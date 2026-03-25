import type {
  ItineraryItemRecord,
  SavedPlaceRecord,
  TripDayRecord,
  TripRecord,
} from "@/lib/types/domain";

function toUtcDate(dateString: string) {
  return new Date(`${dateString}T00:00:00.000Z`);
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function buildTripDayRows(tripId: string, startDate: string, endDate: string) {
  const rows: { trip_id: string; day_number: number; trip_date: string }[] = [];
  const cursor = toUtcDate(startDate);
  const end = toUtcDate(endDate);
  let dayNumber = 1;

  while (cursor <= end) {
    rows.push({
      trip_id: tripId,
      day_number: dayNumber,
      trip_date: toIsoDate(cursor),
    });

    cursor.setUTCDate(cursor.getUTCDate() + 1);
    dayNumber += 1;
  }

  return rows;
}

export function serializeSavedPlace(row: Record<string, unknown>): SavedPlaceRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    provider: "google_places",
    providerPlaceId: String(row.provider_place_id),
    name: String(row.name),
    formattedAddress: String(row.formatted_address),
    city: String(row.city),
    region: String(row.region),
    countryCode: String(row.country_code),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    googleMapsUri:
      typeof row.google_maps_uri === "string" ? row.google_maps_uri : null,
    photoUrl: typeof row.photo_url === "string" ? row.photo_url : null,
    primaryCategory:
      typeof row.primary_category === "string" ? row.primary_category : null,
    status: row.status as SavedPlaceRecord["status"],
    note: typeof row.note === "string" ? row.note : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function serializeTrip(row: Record<string, unknown>): TripRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    title: String(row.title),
    startDate: String(row.start_date),
    endDate: String(row.end_date),
    visibility: row.visibility as TripRecord["visibility"],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function serializeTripDay(row: Record<string, unknown>): TripDayRecord {
  return {
    id: String(row.id),
    tripId: String(row.trip_id),
    dayNumber: Number(row.day_number),
    tripDate: String(row.trip_date),
    createdAt: typeof row.created_at === "string" ? row.created_at : undefined,
    items: [],
  };
}

export function serializeItineraryItem(row: Record<string, unknown>): ItineraryItemRecord {
  return {
    id: String(row.id),
    tripDayId: String(row.trip_day_id),
    savedPlaceId: String(row.saved_place_id),
    sortOrder: Number(row.sort_order ?? 0),
    note: typeof row.note === "string" ? row.note : null,
    createdAt: typeof row.created_at === "string" ? row.created_at : undefined,
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : undefined,
  };
}

export function formatTripDayLabel(tripDate: string, dayNumber: number) {
  return `${tripDate} (Day ${dayNumber})`;
}
