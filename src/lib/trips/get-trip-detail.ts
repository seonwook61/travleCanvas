import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/env";
import type { SavedPlaceRecord, TripDayRecord } from "@/lib/types/domain";
import {
  serializeItineraryItem,
  serializeSavedPlace,
  serializeTrip,
  serializeTripDay,
} from "@/lib/trips/trip-utils";

export async function getTripDetail(tripId: string) {
  if (!hasSupabasePublicEnv()) {
    return {
      authRequired: true as const,
      trip: null,
      tripDays: [] as TripDayRecord[],
      savedPlaces: [] as SavedPlaceRecord[],
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      authRequired: true as const,
      trip: null,
      tripDays: [] as TripDayRecord[],
      savedPlaces: [] as SavedPlaceRecord[],
    };
  }

  const { data: tripRow } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .eq("user_id", user.id)
    .single();

  if (!tripRow) {
    return {
      authRequired: false as const,
      trip: null,
      tripDays: [] as TripDayRecord[],
      savedPlaces: [] as SavedPlaceRecord[],
    };
  }

  const { data: tripDayRows } = await supabase
    .from("trip_days")
    .select("*")
    .eq("trip_id", tripId)
    .order("day_number", { ascending: true });
  const tripDays = Array.isArray(tripDayRows)
    ? tripDayRows.map((row) => serializeTripDay(row))
    : [];

  const { data: savedPlaceRows } = await supabase
    .from("saved_places")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const savedPlaces = Array.isArray(savedPlaceRows)
    ? savedPlaceRows.map((row) => serializeSavedPlace(row))
    : [];

  if (tripDays.length === 0) {
    return {
      authRequired: false as const,
      trip: serializeTrip(tripRow),
      tripDays,
      savedPlaces,
    };
  }

  const { data: itineraryRows } = await supabase
    .from("itinerary_items")
    .select("*")
    .in(
      "trip_day_id",
      tripDays.map((day) => day.id),
    )
    .order("sort_order", { ascending: true });

  const items = Array.isArray(itineraryRows)
    ? itineraryRows.map((row) => serializeItineraryItem(row))
    : [];
  const savedPlaceMap = new Map(savedPlaces.map((place) => [place.id, place]));

  tripDays.forEach((day) => {
    day.items = items
      .filter((item) => item.tripDayId === day.id)
      .map((item) => ({
        ...item,
        savedPlace: savedPlaceMap.get(item.savedPlaceId),
      }));
  });

  return {
    authRequired: false as const,
    trip: serializeTrip(tripRow),
    tripDays,
    savedPlaces,
  };
}
