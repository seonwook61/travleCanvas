alter table public.profiles enable row level security;
alter table public.saved_places enable row level security;
alter table public.trips enable row level security;
alter table public.trip_days enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.share_links enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "saved_places_manage_own"
on public.saved_places
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "trips_manage_own"
on public.trips
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "trip_days_manage_own"
on public.trip_days
for all
to authenticated
using (
  exists (
    select 1
    from public.trips
    where public.trips.id = public.trip_days.trip_id
      and public.trips.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.trips
    where public.trips.id = public.trip_days.trip_id
      and public.trips.user_id = auth.uid()
  )
);

create policy "itinerary_items_manage_own"
on public.itinerary_items
for all
to authenticated
using (
  exists (
    select 1
    from public.trip_days
    join public.trips on public.trips.id = public.trip_days.trip_id
    where public.trip_days.id = public.itinerary_items.trip_day_id
      and public.trips.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.trip_days
    join public.trips on public.trips.id = public.trip_days.trip_id
    where public.trip_days.id = public.itinerary_items.trip_day_id
      and public.trips.user_id = auth.uid()
  )
);

create policy "share_links_manage_own"
on public.share_links
for all
to authenticated
using (
  exists (
    select 1
    from public.trips
    where public.trips.id = public.share_links.trip_id
      and public.trips.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.trips
    where public.trips.id = public.share_links.trip_id
      and public.trips.user_id = auth.uid()
  )
);
