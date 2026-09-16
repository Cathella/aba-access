-- Real bookings table. aba-access's BOOK01-04 pages already call
-- supabase.from('bookings') directly (insert/select/update) but no
-- migration ever created this table — three later migrations even say
-- "no bookings system exists". A `bookings` table did already exist live,
-- but as leftover dev/test data: facility_id was `text` holding placeholder
-- codes like 'f1'/'f5' that don't map to any real facility, not a uuid FK.
-- Confirmed with the project owner that this data is disposable — dropping
-- and rebuilding with the correct schema rather than trying to migrate it.
--
-- Status vocabulary reuses aba-partner's existing StatusChip.tsx VisitStatus
-- union (pending/confirmed/reschedule-requested/proposed/declined/completed)
-- plus 'cancelled', which that union is missing but both apps need
-- (BOOK04's cancel action, aba-partner's CancelBooking.tsx).

drop table if exists bookings cascade;

create table bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  dependent_id uuid references dependents(id) on delete set null,
  patient_name text not null,
  facility_id uuid not null references facilities(id) on delete cascade,
  facility_name text not null,
  service text not null,
  preferred_date text not null,
  preferred_time text not null,
  notes text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','reschedule-requested','proposed','declined','cancelled','completed')),
  proposed_date text,
  proposed_time text,
  proposal_reason text,
  decline_reason text,
  decline_notes text,
  assigned_staff_id uuid references facility_staff_invitations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on bookings (user_id, created_at desc);
create index if not exists bookings_facility_id_idx on bookings (facility_id, status, created_at desc);

alter table bookings enable row level security;

drop policy if exists "members view own bookings" on bookings;
create policy "members view own bookings" on bookings
  for select using (auth.uid() = user_id);

drop policy if exists "members create own bookings" on bookings;
create policy "members create own bookings" on bookings
  for insert with check (auth.uid() = user_id);

drop policy if exists "members update own bookings" on bookings;
create policy "members update own bookings" on bookings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Facility admin gets "for all" (matches facility_staff_invitations' shape).
-- Staff gets select+update only — bookings are always member-initiated, so
-- staff never inserts/deletes one directly.
drop policy if exists "facility admin manages own bookings" on bookings;
create policy "facility admin manages own bookings" on bookings
  for all using (is_facility_admin(facility_id)) with check (is_facility_admin(facility_id));

drop policy if exists "staff views facility bookings" on bookings;
create policy "staff views facility bookings" on bookings
  for select using (is_active_staff(facility_id));

drop policy if exists "staff updates facility bookings" on bookings;
create policy "staff updates facility bookings" on bookings
  for update using (is_active_staff(facility_id)) with check (is_active_staff(facility_id));
