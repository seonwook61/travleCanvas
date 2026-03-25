create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null default 'google_places',
  provider_place_id text not null,
  name text not null,
  formatted_address text not null,
  city text not null,
  region text not null,
  country_code text not null check (char_length(country_code) = 2),
  latitude double precision not null,
  longitude double precision not null,
  google_maps_uri text,
  photo_url text,
  primary_category text,
  status text not null check (status in ('wishlist', 'visited', 'favorite')),
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, provider_place_id)
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  start_date date not null,
  end_date date not null,
  visibility text not null default 'private' check (visibility in ('private')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (end_date >= start_date)
);

create table if not exists public.trip_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  day_number integer not null check (day_number >= 1),
  trip_date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (trip_id, day_number),
  unique (trip_id, trip_date)
);

create table if not exists public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_day_id uuid not null references public.trip_days (id) on delete cascade,
  saved_place_id uuid not null references public.saved_places (id) on delete cascade,
  sort_order integer not null default 0,
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (trip_day_id, saved_place_id)
);

create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  token text not null unique,
  permission text not null default 'read_only' check (permission in ('read_only')),
  created_by uuid not null references auth.users (id) on delete cascade,
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists saved_places_user_status_idx on public.saved_places (user_id, status);
create index if not exists trips_user_idx on public.trips (user_id, start_date);
create index if not exists trip_days_trip_idx on public.trip_days (trip_id, day_number);
create index if not exists itinerary_items_trip_day_idx on public.itinerary_items (trip_day_id, sort_order);
create index if not exists share_links_trip_idx on public.share_links (trip_id);
