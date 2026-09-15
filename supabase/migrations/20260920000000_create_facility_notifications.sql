-- Notifications.tsx (facility-admin feed) showed 8 hardcoded fake events —
-- pending settlements, bookings, payments — none backed by any real system.
-- Most of those categories genuinely can't be real yet (no bookings/finance
-- tables exist), so this feed will be sparse until those systems exist. But
-- what it does show is real: it's populated by actual admin actions already
-- possible today (staff added/removed, blackout date added, service
-- added/removed), inserted at the point those actions happen in
-- facilitySetup.ts.

create table if not exists facility_notifications (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  type text not null check (type in ('alert', 'success', 'info', 'warning')),
  category text not null check (category in ('bookings', 'finance', 'staff', 'system')),
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists facility_notifications_facility_id_idx on facility_notifications (facility_id, created_at desc);

alter table facility_notifications enable row level security;

drop policy if exists "facility admin manages own notifications" on facility_notifications;
create policy "facility admin manages own notifications"
  on facility_notifications for all
  using (is_facility_admin(facility_id))
  with check (is_facility_admin(facility_id));
