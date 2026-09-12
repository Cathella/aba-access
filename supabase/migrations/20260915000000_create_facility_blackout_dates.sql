-- BlackoutDates.tsx/AddBlackoutDate.tsx were entirely local mock state — a
-- hardcoded 4-entry list, and "Add"/"Remove" only toasted without writing
-- anywhere. Same admin-only visibility model as facility_staff_invitations:
-- blackout dates aren't shown to members anywhere today (no bookings system
-- reads them yet), so this is private operational data for now.

create table if not exists facility_blackout_dates (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  date date not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists facility_blackout_dates_facility_id_idx on facility_blackout_dates (facility_id);

alter table facility_blackout_dates enable row level security;

drop policy if exists "facility admin manages own blackout dates" on facility_blackout_dates;
create policy "facility admin manages own blackout dates"
  on facility_blackout_dates for all
  using (is_facility_admin(facility_id))
  with check (is_facility_admin(facility_id));
