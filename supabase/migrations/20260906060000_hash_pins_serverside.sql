-- PINs were stored as btoa(pin) — base64 encoding, trivially reversible with
-- atob(), not real hashing — and checked by fetching pin_hash to the browser
-- and comparing there. This replaces both problems: pin_hash is now a real
-- bcrypt hash (via pgcrypto), and it's set/checked entirely inside these two
-- functions so the hash itself never has to leave the database.
--
-- Existing PINs stored the old way cannot be verified against this scheme —
-- there's no way to convert a btoa() value into a bcrypt hash without the
-- original PIN. Anyone with a PIN set under the old scheme needs to set a
-- new one once (fine pre-pilot; only test accounts exist so far).

-- Supabase installs pgcrypto into the "extensions" schema, not "public" —
-- both functions below need it on their search_path to see gen_salt/crypt.
create extension if not exists pgcrypto with schema extensions;

create or replace function set_pin(pin text)
returns void
language sql
security definer
set search_path = public, extensions
as $$
  update users set pin_hash = crypt(pin, gen_salt('bf')) where id = auth.uid();
$$;

create or replace function verify_pin(pin text)
returns boolean
language sql
security definer
set search_path = public, extensions
stable
as $$
  select coalesce(
    (select pin_hash = crypt(pin, pin_hash) from users where id = auth.uid()),
    false
  );
$$;

revoke all on function set_pin(text) from public;
revoke all on function verify_pin(text) from public;
grant execute on function set_pin(text) to authenticated;
grant execute on function verify_pin(text) to authenticated;
