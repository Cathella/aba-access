-- Wallet ledger backing WAL01/WAL03 and the PKG-03 checkout balance check.
-- Balance is derived client-side as sum(credit completed) - sum(debit completed);
-- no separate balance column to avoid it drifting out of sync with the ledger.
create table if not exists wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null check (type in ('package_purchase', 'topup', 'oop')),
  title text not null,
  subtitle text not null,
  amount_ugx integer not null check (amount_ugx > 0),
  direction text not null check (direction in ('credit', 'debit')),
  status text not null default 'completed' check (status in ('completed', 'pending', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists wallet_transactions_user_id_created_at_idx
  on wallet_transactions (user_id, created_at desc);

alter table wallet_transactions enable row level security;

drop policy if exists "Users can view their own wallet transactions" on wallet_transactions;
create policy "Users can view their own wallet transactions"
  on wallet_transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own wallet transactions" on wallet_transactions;
create policy "Users can create their own wallet transactions"
  on wallet_transactions for insert
  with check (auth.uid() = user_id);
