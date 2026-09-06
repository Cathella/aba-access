-- Brings the ABA Partner app's schema (facilities, invites, admins) into this
-- project so both apps share one backend. aba-partner previously ran on its
-- own separate Supabase project with this same schema (see its
-- supabase/migrations/001-003) but its frontend never actually called
-- Supabase yet, so there's no data to migrate — just the table shapes.
--
-- facilities gets extra columns beyond what aba-partner defined, since this
-- app's facility directory (FAC01/FAC02/BOOK01/BOOK04/home) needs a type,
-- address, and hours where aba-partner only tracked name/phone/active-state.

create table if not exists facilities (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  phone              text not null,
  is_active          boolean not null default false,
  admin_contact_name text,
  -- Added for the member-facing directory (aba-access):
  types              text[] not null default '{}',
  address            text,
  region             text,
  hours_note         text,
  is_open            boolean not null default true,
  created_at         timestamptz not null default now()
);

create table if not exists facility_invites (
  id          uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  token       text not null unique,
  used        boolean not null default false,
  expires_at  timestamptz not null default (now() + interval '7 days'),
  created_at  timestamptz not null default now()
);

create table if not exists facility_admins (
  id          uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  pin_hash    text not null,
  created_at  timestamptz not null default now()
);

-- One row per ABA team member; auth.uid() is the Supabase Auth user id
-- created when a team member is added via Supabase Dashboard → Authentication.
create table if not exists aba_admins (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  created_at timestamptz not null default now()
);

create or replace function is_aba_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from aba_admins where id = auth.uid()
  );
$$;

alter table facilities       enable row level security;
alter table facility_invites enable row level security;
alter table facility_admins  enable row level security;
alter table aba_admins       enable row level security;

-- Facilities: ABA admins manage everything; anyone can read (matches
-- aba-partner's own MVP-stage policy — not tightened here).
drop policy if exists "aba admin full access on facilities" on facilities;
create policy "aba admin full access on facilities"
  on facilities for all
  using (is_aba_admin())
  with check (is_aba_admin());

drop policy if exists "anon can read facilities" on facilities;
create policy "anon can read facilities"
  on facilities for select
  using (true);

-- Invites: readable by anyone holding the token; ABA admins manage them.
drop policy if exists "invite lookup by token" on facility_invites;
create policy "invite lookup by token"
  on facility_invites for select
  using (true);

drop policy if exists "aba admin full access on invites" on facility_invites;
create policy "aba admin full access on invites"
  on facility_invites for all
  using (is_aba_admin())
  with check (is_aba_admin());

-- Facility admins: created during invite acceptance (anon insert, validated
-- by token client-side); can read their own row.
drop policy if exists "anon can insert facility admin during onboarding" on facility_admins;
create policy "anon can insert facility admin during onboarding"
  on facility_admins for insert
  with check (true);

drop policy if exists "facility admin reads own row" on facility_admins;
create policy "facility admin reads own row"
  on facility_admins for select
  using (true);

-- ABA admins can read their own record.
drop policy if exists "aba admin reads own row" on aba_admins;
create policy "aba admin reads own row"
  on aba_admins for select
  using (auth.uid() = id);
