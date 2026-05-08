# Supabase Setup for ABA Access

## Environment Variables
Copy `.env.example` to `.env.local` and fill in your Supabase project values:

```bash
cp .env.example .env.local
```

Required variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

## Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Enable phone auth extension
create extension if not exists "uuid-ossp";

-- Users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  phone text unique not null,
  pin_hash text,
  member_id text unique,
  full_name text,
  district text,
  area_town text,
  created_at timestamp default now()
);

-- Allow Supabase Auth users to be linked
-- This happens automatically via the auth.users table
```

## Phone Authentication Setup

1. In Supabase Dashboard → Authentication → Providers
2. Enable "Phone" provider
3. Configure SMS provider (Twilio recommended for Uganda)
4. Add test phone numbers if in development

## PIN-based Login (Custom Function)

Create this function in SQL editor:

```sql
create or replace function verify_pin_and_login(
  phone_input text,
  pin_input text
) returns json as $$
declare
  user_record users%rowtype;
  auth_user auth.users%rowtype;
begin
  -- Find user by phone
  select * into user_record from users where phone = phone_input;
  if not found then
    raise exception 'User not found';
  end if;

  -- Verify PIN (in production, use bcrypt.compare)
  -- For demo, store PIN as plain text (NOT SECURE - use proper hashing)
  if user_record.pin_hash != pin_input then
    raise exception 'Invalid PIN';
  end if;

  -- Create/get auth user (simplified)
  return json_build_object('success', true);
end;
$$ language plpgsql security definer;
```

## Security Notes

- Store PIN as bcrypt hash, NOT plain text
- Use Supabase Row Level Security (RLS) policies
- Enable MFA for sensitive operations
- Rate limit OTP requests (Supabase handles this by default)