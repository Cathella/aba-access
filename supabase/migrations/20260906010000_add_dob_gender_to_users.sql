-- dob/gender were captured on the signup form (AUTH-06B) and the profile
-- settings form (SET-01) but only ever written to localStorage — never to
-- the users table — so edits silently never reached the backend.
alter table users add column if not exists dob date;
alter table users add column if not exists gender text check (gender in ('Male', 'Female', 'Other'));
