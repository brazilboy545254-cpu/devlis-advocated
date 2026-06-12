create extension if not exists "pgcrypto";

create table if not exists public.users (
  uid text primary key,
  name text not null,
  email text not null,
  photo_url text,
  login_method text not null default 'Google / Gmail',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique references public.users(uid) on delete cascade,
  language text not null default 'en',
  theme text not null default 'dark',
  updated_at timestamptz not null default now()
);

create table if not exists public.qr_history (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(uid) on delete cascade,
  original_name text not null,
  reference_name text not null,
  original_path text not null,
  reference_path text not null,
  result_path text not null,
  download_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.app_settings enable row level security;
alter table public.qr_history enable row level security;

create policy "service role manages users" on public.users for all using (false) with check (false);
create policy "service role manages app_settings" on public.app_settings for all using (false) with check (false);
create policy "service role manages qr_history" on public.qr_history for all using (false) with check (false);
