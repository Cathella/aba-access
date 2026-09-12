-- The facility-side setup wizard (7 steps: profile, hours, departments,
-- services, payments, staff, review) collected everything into local React
-- state that was discarded the moment ReviewStep's fake "Simulate API call"
-- timeout finished. Nothing reached the database except is_active, which
-- CreatePin.tsx already sets independently of this wizard.
--
-- facilities gains the columns the wizard actually edits. Services and
-- staff invitations are separate tables since they're naturally
-- one-to-many per facility.

alter table facilities add column if not exists email text;
alter table facilities add column if not exists operating_hours jsonb;
alter table facilities add column if not exists departments jsonb;

create table if not exists facility_services (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  name text not null,
  category text not null,
  price_ugx integer not null,
  duration_minutes integer not null,
  created_at timestamptz not null default now()
);

create index if not exists facility_services_facility_id_idx on facility_services (facility_id);

-- Record-keeping only — there is no real staff account system yet (no
-- invite-accept flow, no staff auth). This just remembers who a facility
-- admin said they'd invite; it does not send anything and does not create
-- a login of any kind.
create table if not exists facility_staff_invitations (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  name text not null,
  contact text not null,
  role text not null,
  created_at timestamptz not null default now()
);

create index if not exists facility_staff_invitations_facility_id_idx on facility_staff_invitations (facility_id);

alter table facility_services enable row level security;
alter table facility_staff_invitations enable row level security;

-- Services are meant to be facility-facing pricing info, same visibility
-- model as facilities itself (public read, admin-only write).
drop policy if exists "anyone can read facility services" on facility_services;
create policy "anyone can read facility services"
  on facility_services for select
  using (true);

drop policy if exists "facility admin manages own services" on facility_services;
create policy "facility admin manages own services"
  on facility_services for all
  using (is_facility_admin(facility_id))
  with check (is_facility_admin(facility_id));

-- Staff invitations contain personal contact info — admin-only, not public.
drop policy if exists "facility admin manages own staff invitations" on facility_staff_invitations;
create policy "facility admin manages own staff invitations"
  on facility_staff_invitations for all
  using (is_facility_admin(facility_id))
  with check (is_facility_admin(facility_id));
