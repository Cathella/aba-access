-- Staff auth was 100% client-side theater: StaffSignIn only checked
-- phone.length >= 9, StaffOTPVerification accepted any 6-digit code,
-- StaffEnterPin accepted any 4-digit PIN, StaffResetPin's hardcoded OTP was
-- '123456', and RoleRouter was a manual button picker, not routing logic.
-- All 111 role-specific routes (/r/*, /cl/*, /lt/*, /ph/*, /nu/*, /ac/*)
-- sat completely unguarded at the router level.
--
-- This gives facility_staff_invitations a real account: a staff member
-- claims their invitation once (linking a real auth.users row, matched by
-- phone the same way facility admins and members already work), gets a real
-- bcrypt-hashed PIN, and their stored role drives real routing instead of a
-- picker. Mirrors 20260907000000_facility_admin_real_auth.sql's pattern.
--
-- Known limitation, same simplifying assumption as facility admins: this
-- only supports phone-based invitations. A staff member invited via email
-- (InviteStaff.tsx allows either) can't use this sign-in flow yet.

alter table facility_staff_invitations add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table facility_staff_invitations add column if not exists status text not null default 'invited' check (status in ('invited', 'active', 'deactivated'));
alter table facility_staff_invitations add column if not exists pin_hash text;

create unique index if not exists facility_staff_invitations_user_id_idx on facility_staff_invitations (user_id) where user_id is not null;

-- Public/anon-callable: StaffSignIn needs to know which screen to show next
-- (PIN login vs. first-time PIN setup) before any session exists. Discloses
-- only status + first name — same disclosure level already accepted for
-- facility invite lookups (InviteLanding.tsx personalizes by facility name
-- via a public token lookup).
create or replace function check_staff_invite(p_phone text)
returns table (status text, staff_name text)
language sql
security definer
set search_path = public
stable
as $$
  select fsi.status, fsi.name
  from facility_staff_invitations fsi
  where fsi.contact = p_phone
  limit 1;
$$;

revoke all on function check_staff_invite(text) from public;
grant execute on function check_staff_invite(text) to anon, authenticated;

-- Accept flow: caller has already created an auth.users row (signUp with
-- phone-derived fake credentials, same pattern as facility admins) and is
-- authenticated as auth.uid() when this runs. security definer lets it find
-- and claim a row that RLS would otherwise hide (user_id is still null).
create or replace function accept_staff_invite(p_phone text, p_pin text)
returns table (facility_id uuid, staff_name text, staff_role text)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id uuid;
begin
  select fsi.id into v_id
  from facility_staff_invitations fsi
  where fsi.contact = p_phone and fsi.status = 'invited' and fsi.user_id is null
  limit 1;

  if v_id is null then
    raise exception 'No pending invitation found for this phone number.';
  end if;

  return query
  update facility_staff_invitations fsi
  set user_id = auth.uid(), status = 'active', pin_hash = crypt(p_pin, gen_salt('bf'))
  where fsi.id = v_id
  returning fsi.facility_id, fsi.name, fsi.role;
end;
$$;

revoke all on function accept_staff_invite(text, text) from public;
grant execute on function accept_staff_invite(text, text) to authenticated;

-- Same pgcrypto-based pattern as set_facility_pin/verify_facility_pin.
create or replace function set_staff_pin(p_pin text)
returns void
language sql
security definer
set search_path = public, extensions
as $$
  update facility_staff_invitations set pin_hash = crypt(p_pin, gen_salt('bf')) where user_id = auth.uid();
$$;

create or replace function verify_staff_pin(p_pin text)
returns boolean
language sql
security definer
set search_path = public, extensions
stable
as $$
  select coalesce(
    (select pin_hash = crypt(p_pin, pin_hash) from facility_staff_invitations where user_id = auth.uid() and status = 'active'),
    false
  );
$$;

revoke all on function set_staff_pin(text) from public;
revoke all on function verify_staff_pin(text) from public;
grant execute on function set_staff_pin(text) to authenticated;
grant execute on function verify_staff_pin(text) to authenticated;

-- Helper for guards / future RLS: is the signed-in user an active staff
-- member of this facility?
create or replace function is_active_staff(fid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from facility_staff_invitations
    where user_id = auth.uid() and facility_id = fid and status = 'active'
  );
$$;

-- Staff can now read their own row (profile display, role-based routing) —
-- previously this table was admin-only, per its original migration comment.
drop policy if exists "staff reads own row" on facility_staff_invitations;
create policy "staff reads own row"
  on facility_staff_invitations for select
  using (auth.uid() = user_id);

-- Facility admins already have "for all" access to this table for record-
-- keeping (name/contact/role). That must not extend to writing a plaintext
-- PIN — same column-level lock already applied to facility_admins.pin_hash.
revoke update (pin_hash) on facility_staff_invitations from authenticated, anon;
