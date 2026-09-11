-- AUTH-04 (consent screen) runs after signUp() but before completeProfile()
-- creates the users row, so this references auth.users directly rather than
-- the public users table. Previously, checking both boxes let the user
-- continue with no record ever written anywhere.
create table if not exists consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  terms_accepted_at timestamptz not null default now(),
  privacy_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists consents_user_id_idx on consents (user_id);

alter table consents enable row level security;

drop policy if exists "Users can view their own consent record" on consents;
create policy "Users can view their own consent record"
  on consents for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own consent record" on consents;
create policy "Users can create their own consent record"
  on consents for insert
  with check (auth.uid() = user_id);
