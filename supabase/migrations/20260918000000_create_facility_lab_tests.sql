-- TestsCatalog.tsx showed the exact same hardcoded ~23-test menu to every
-- facility with no way to persist which tests they actually offer — toggles
-- and "Save Catalog" only updated local state. Same shape/visibility model
-- as facility_services: each facility gets its own independent, editable
-- set of rows, seeded once from the standard test list on first visit.

create table if not exists facility_lab_tests (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  name text not null,
  code text not null,
  category text not null,
  price_ugx integer not null,
  turnaround text not null,
  specimen text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists facility_lab_tests_facility_id_idx on facility_lab_tests (facility_id);

alter table facility_lab_tests enable row level security;

-- Same visibility model as facility_services: public read (facility-facing
-- pricing/availability info), admin-only write.
drop policy if exists "anyone can read facility lab tests" on facility_lab_tests;
create policy "anyone can read facility lab tests"
  on facility_lab_tests for select
  using (true);

drop policy if exists "facility admin manages own lab tests" on facility_lab_tests;
create policy "facility admin manages own lab tests"
  on facility_lab_tests for all
  using (is_facility_admin(facility_id))
  with check (is_facility_admin(facility_id));
