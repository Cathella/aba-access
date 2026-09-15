-- CapacityRules.tsx collected max-bookings-per-slot and buffer-time into
-- local state only, discarded on navigation; "Save" just toasted success.
-- Neither field has any consumer yet (no real bookings system exists), so
-- this is config only for now — same status as PaymentMethods' toggles.

alter table facilities add column if not exists max_bookings_per_slot integer not null default 3;
alter table facilities add column if not exists buffer_time_minutes integer not null default 15;
