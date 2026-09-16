-- Real visits table — the shared "who's physically in the building, at
-- what status, assigned to whom" record. Created when a booking is checked
-- in, or directly for a walk-in (booking_id null). This replaces the
-- identity/status fields currently duplicated across three disconnected
-- in-memory mock stores in aba-partner (scheduleStore.ts, clinicianStore.ts's
-- CLQueueItem, nurseStore.ts's NUQueueItem) — those stores keep their own
-- richer clinical/workflow fields (SOAP notes, vitals, diagnoses, coverage
-- info, etc.), just keyed by this table's real id going forward instead of
-- their own fake clv-*/nq-*/sch-* ids. That richer clinical data intentionally
-- stays out of Postgres in this phase — a separate, later piece of work.
--
-- Patient identity is denormalized (patient_name/patient_phone/is_member)
-- rather than purely FK-based, because a walk-in may have no users/dependents
-- row at all — user_id/dependent_id are nullable, populated only when the
-- patient is a known real member.
--
-- No member-facing (aba-access) RLS policy in this phase — no aba-access
-- screen reads visits yet.

create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete set null,
  facility_id uuid not null references facilities(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  dependent_id uuid references dependents(id) on delete set null,
  patient_name text not null,
  patient_phone text,
  is_member boolean not null default false,
  service text not null,
  type text not null check (type in ('appointment','walk-in')),
  status text not null default 'arrived'
    check (status in ('arrived','checked-in','waiting','in-consultation','lab','pharmacy','completed','no-show')),
  ticket text,
  room text,
  assigned_staff_id uuid references facility_staff_invitations(id) on delete set null,
  checked_in_at timestamptz,
  checked_in_by uuid references facility_staff_invitations(id) on delete set null,
  notes text,
  transfer_note text,
  removal_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists visits_facility_id_idx on visits (facility_id, status, created_at desc);
create index if not exists visits_booking_id_idx on visits (booking_id);

alter table visits enable row level security;

-- Facility-only in this phase. Staff needs insert here (check-in / walk-in
-- registration), unlike bookings which are always member-initiated.
drop policy if exists "facility admin manages own visits" on visits;
create policy "facility admin manages own visits" on visits
  for all using (is_facility_admin(facility_id)) with check (is_facility_admin(facility_id));

drop policy if exists "staff manages facility visits" on visits;
create policy "staff manages facility visits" on visits
  for all using (is_active_staff(facility_id)) with check (is_active_staff(facility_id));
