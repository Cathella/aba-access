-- email and emergency contact fields exist on the SET-01 profile form but
-- were never persisted anywhere — not to this table, not even to
-- localStorage — so they always reset to blank.
alter table users add column if not exists email text;
alter table users add column if not exists emergency_contact_name text;
alter table users add column if not exists emergency_contact_phone text;
