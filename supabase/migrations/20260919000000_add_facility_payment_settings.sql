-- PaymentMethods.tsx's accept-Wallet/Cash/Corporate and split-payments
-- toggles were local state only, reset on every visit. These are facility-
-- wide payment-acceptance policy, unlike require_pin_refunds (already added
-- to facility_admins in 20260917000000 — that one stays per-admin and is
-- now shared between SecurityAndPin.tsx and this screen instead of
-- duplicated).
--
-- Deliberately NOT adding settlement account name/number/verified-status
-- columns: no flow anywhere collects a real bank account or verifies one,
-- so there is nothing real to persist there yet — the screen now shows an
-- honest "not set up" state instead of fabricated banking details.

alter table facilities add column if not exists accepts_aba_wallet boolean not null default true;
alter table facilities add column if not exists accepts_cash boolean not null default true;
alter table facilities add column if not exists accepts_corporate boolean not null default false;
alter table facilities add column if not exists allow_split_payments boolean not null default true;
