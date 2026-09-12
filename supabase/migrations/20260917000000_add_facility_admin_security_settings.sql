-- SecurityAndPin.tsx's "require PIN for X" / "require OTP on new device" /
-- auto-lock toggles were local state only, reset on every visit. These are
-- per-admin-account preferences (not facility-wide), so they belong on
-- facility_admins, not facilities.
--
-- The "Active Sessions" device list on this same screen was removed instead
-- of fixed — there's no session-tracking table anywhere and no way to list
-- a user's active device sessions from the client SDK, same fake pattern
-- already removed from ProfileSettings.tsx.

alter table facility_admins add column if not exists require_pin_refunds boolean not null default true;
alter table facility_admins add column if not exists require_pin_role_changes boolean not null default true;
alter table facility_admins add column if not exists require_pin_settlements boolean not null default true;
alter table facility_admins add column if not exists require_otp_new_device boolean not null default true;
alter table facility_admins add column if not exists auto_lock_enabled boolean not null default true;
alter table facility_admins add column if not exists auto_lock_minutes integer not null default 15;

-- facility_admins previously had only insert/select policies for the admin's
-- own row (pin_hash writes went through a security-definer RPC, bypassing
-- RLS). These new plain columns need a real update policy for the admin to
-- save their own settings directly.
drop policy if exists "facility admin updates own security settings" on facility_admins;
create policy "facility admin updates own security settings"
  on facility_admins for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- RLS is row-level only — without this, the new update policy above would
-- let a client overwrite pin_hash directly via a plain .update() call,
-- bypassing set_facility_pin's bcrypt hashing entirely. Column-level REVOKE
-- closes that regardless of any table-level policy.
revoke update (pin_hash) on facility_admins from authenticated, anon;
