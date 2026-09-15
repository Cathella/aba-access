-- Notifications.tsx is moving from admin-only to shared-by-every-role (like
-- /profile-settings, /help-center, /privacy-policy) — every staff member on
-- a facility should see the same facility-wide notification feed the admin
-- sees, since there's no per-user read state (facility_notifications has no
-- user_id column; "read" is shared across whoever's looking).
--
-- is_active_staff already exists (20260922000000_staff_real_auth.sql).

drop policy if exists "staff manages own facility notifications" on facility_notifications;
create policy "staff manages own facility notifications"
  on facility_notifications for all
  using (is_active_staff(facility_id))
  with check (is_active_staff(facility_id));
