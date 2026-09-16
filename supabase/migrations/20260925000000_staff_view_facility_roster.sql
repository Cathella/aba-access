-- CLVisitSummary's "Reassign Patient" sheet needs to list other doctors at
-- the same facility — previously a hardcoded 2-doctor mock list
-- (dr-ssekandi/dr-nambi). Staff could so far only read their OWN row
-- (20260922000000_staff_real_auth.sql); this lets any active staff member
-- see the rest of their facility's roster (name + role), the same
-- disclosure level admins already have via the "for all" policy.

drop policy if exists "staff views facility roster" on facility_staff_invitations;
create policy "staff views facility roster"
  on facility_staff_invitations for select
  using (is_active_staff(facility_id));
