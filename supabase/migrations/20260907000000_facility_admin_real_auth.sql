-- aba-partner had NO real authentication anywhere: facility_admins.id was a
-- standalone random uuid (not tied to auth.users), PINs were stored as plain
-- text, Login.tsx matched a PIN against the whole table with no facility
-- filter, and RLS on facilities/facility_admins/facility_invites was wide
-- open (using (true)) because there was no auth.uid() to scope by.
--
-- This gives facility admins a real Supabase Auth identity (created at
-- invite-acceptance time in aba-partner, via facilityPhoneToCredentials —
-- namespaced with a distinct fake-email domain from aba-access's member
-- accounts so the same phone number can never collide into the same
-- auth.users row across the two apps), real bcrypt PIN hashing checked
-- entirely server-side, and RLS finally scoped to the signed-in facility.
--
-- Any existing facility_admins rows predate real auth entirely (inserted
-- with a random id, never linked to any auth.users row) and cannot be
-- migrated forward — cleared here so the new foreign key can be added.
delete from facility_admins;

alter table facility_admins
  alter column id drop default;

alter table facility_admins
  add constraint facility_admins_id_fkey foreign key (id) references auth.users(id) on delete cascade;

-- Same pgcrypto-based pattern as aba-access's set_pin/verify_pin, scoped to
-- facility_admins instead of users.
create or replace function set_facility_pin(pin text)
returns void
language sql
security definer
set search_path = public, extensions
as $$
  update facility_admins set pin_hash = crypt(pin, gen_salt('bf')) where id = auth.uid();
$$;

create or replace function verify_facility_pin(pin text)
returns boolean
language sql
security definer
set search_path = public, extensions
stable
as $$
  select coalesce(
    (select pin_hash = crypt(pin, pin_hash) from facility_admins where id = auth.uid()),
    false
  );
$$;

revoke all on function set_facility_pin(text) from public;
revoke all on function verify_facility_pin(text) from public;
grant execute on function set_facility_pin(text) to authenticated;
grant execute on function verify_facility_pin(text) to authenticated;

-- Helper: does the signed-in user administer the given facility?
create or replace function is_facility_admin(fid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from facility_admins where id = auth.uid() and facility_id = fid
  );
$$;

-- ── Tighten RLS now that auth.uid() means something real ──

-- facility_admins: was "anon can insert" / "reads own row" using (true).
drop policy if exists "anon can insert facility admin during onboarding" on facility_admins;
drop policy if exists "facility admin reads own row" on facility_admins;

create policy "facility admin inserts own row during onboarding"
  on facility_admins for insert
  with check (auth.uid() = id);

create policy "facility admin reads own row"
  on facility_admins for select
  using (auth.uid() = id);

-- facility_invites: token lookup stays public (the token itself is the
-- secret, read before any session exists) and ABA-admin-full-access is
-- unchanged. Add: the facility admin who just authenticated can mark their
-- own invite used.
drop policy if exists "facility admin can mark own invite used" on facility_invites;
create policy "facility admin can mark own invite used"
  on facility_invites for update
  using (is_facility_admin(facility_id))
  with check (is_facility_admin(facility_id));

-- facilities: public read stays (aba-access's member directory depends on
-- it) and ABA-admin-full-access is unchanged. Add: a facility's own admin
-- can update their facility row (needed for the is_active activation step,
-- and later for the setup wizard to persist real profile/hours/services).
drop policy if exists "facility admin can update own facility" on facilities;
create policy "facility admin can update own facility"
  on facilities for update
  using (is_facility_admin(id))
  with check (is_facility_admin(id));
