-- NotificationSettings.tsx tracked ~20 toggles/fields in local state only;
-- "Save Changes" just toasted success and reset on reload. Same pattern as
-- users.notification_prefs (20260906030000_add_notification_prefs_to_users.sql)
-- — one flexible jsonb column rather than one column per toggle.

alter table facilities add column if not exists notification_prefs jsonb;
