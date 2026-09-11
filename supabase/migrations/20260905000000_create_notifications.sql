-- Notifications shown on HOME02NotificationsPage.
-- type drives icon/color on the client (see notificationCatalog.ts).
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null check (type in ('booking_confirmed', 'booking_pending', 'approval_request', 'wallet_topup')),
  title text not null,
  body text not null,
  route text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_created_at_idx
  on notifications (user_id, created_at desc);

alter table notifications enable row level security;

drop policy if exists "Users can view their own notifications" on notifications;
create policy "Users can view their own notifications"
  on notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can mark their own notifications as read" on notifications;
create policy "Users can mark their own notifications as read"
  on notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
