-- Staff could read their own facility_staff_invitations row (added in
-- 20260922000000) but not update it — needed now so a staff member can
-- edit their own name from /profile-settings, the same way a facility
-- admin already can via facilities.admin_contact_name.
--
-- The existing column-level lock (revoke update (pin_hash)) already
-- prevents this from being used to bypass set_staff_pin's bcrypt hashing.

drop policy if exists "staff updates own row" on facility_staff_invitations;
create policy "staff updates own row"
  on facility_staff_invitations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
