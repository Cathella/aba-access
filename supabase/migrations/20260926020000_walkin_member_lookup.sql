-- Walk-in registration currently checks a hardcoded fake member directory
-- in aba-partner (walkInStore.ts) instead of real members. This RPC lets a
-- signed-in facility admin or active staff member look up a real member (and
-- their dependents) by phone, so walk-in check-in can verify an actual
-- identity instead of matching against 7 hardcoded names.
--
-- Mirrors check_staff_invite's narrow-disclosure shape, but additionally
-- gates the caller — unlike check_staff_invite (which only discloses the
-- caller's own invite), this discloses a third party's PII, so it must be
-- restricted to authenticated facility staff/admins, and only returns
-- name/relationship/dob/ids — no email, address, wallet, or financial data.

create or replace function lookup_member_by_phone(p_phone text)
returns table (
  user_id uuid,
  full_name text,
  dependent_id uuid,
  dependent_name text,
  dependent_relationship text,
  dependent_dob date
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not exists (
    select 1 from facility_admins where id = auth.uid()
    union all
    select 1 from facility_staff_invitations where user_id = auth.uid() and status = 'active'
  ) then
    raise exception 'Not authorized.';
  end if;

  return query
  select u.id, u.full_name, d.id, d.full_name, d.relationship, d.dob
  from users u
  left join dependents d on d.user_id = u.id
  where u.phone = p_phone;
end;
$$;

revoke all on function lookup_member_by_phone(text) from public, anon;
grant execute on function lookup_member_by_phone(text) to authenticated;
