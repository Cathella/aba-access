-- Notification toggles on SET-03 were local useState only — every choice
-- reset to the hardcoded defaults on navigation. Stored as one jsonb blob
-- since it's a small, page-local settings bundle with no other consumer yet.
alter table users add column if not exists notification_prefs jsonb not null default '{
  "approvals": true,
  "packageReminders": true,
  "careUpdates": true,
  "promotions": false,
  "inApp": true
}'::jsonb;
