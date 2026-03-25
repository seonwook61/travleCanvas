import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ShareLinkPermission } from "@/lib/types/domain";
import {
  serializeItineraryItem,
  serializeSavedPlace,
  serializeTrip,
  serializeTripDay,
} from "@/lib/trips/trip-utils";

export interface SharedPlaceRecord {
  id: string;
  provider: "google_places";
  providerPlaceId: string;
  name: string;
  formattedAddress: string;
  city: string;
  region: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  googleMapsUri?: string | null;
  photoUrl?: string | null;
  primaryCategory?: string | null;
  status: "wishlist" | "visited" | "favorite";
  note: string | null;
}

export interface SharedItineraryItemRecord {
  id: string;
  tripDayId: string;
  savedPlaceId: string;
  sortOrder: number;
  note: string | null;
  savedPlace?: SharedPlaceRecord;
}

export interface SharedTripDayRecord {
  id: string;
  tripId: string;
  dayNumber: number;
  tripDate: string;
  items: SharedItineraryItemRecord[];
}

export interface SharedTripRecord {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  visibility: "private";
}

export interface SharedTripDetail {
  shareLink: {
    id: string;
    token: string;
    permission: ShareLinkPermission;
  };
  trip: SharedTripRecord;
  tripDays: SharedTripDayRecord[];
  savedPlaceHighlights: SharedPlaceRecord[];
}

function toSharedPlace(
  place: ReturnType<typeof serializeSavedPlace>,
): SharedPlaceRecord {
  return {
    id: place.id,
    provider: place.provider,
    providerPlaceId: place.providerPlaceId,
    name: place.name,
    formattedAddress: place.formattedAddress,
    city: place.city,
    region: place.region,
    countryCode: place.countryCode,
    latitude: place.latitude,
    longitude: place.longitude,
    googleMapsUri: place.googleMapsUri,
    photoUrl: place.photoUrl,
    primaryCategory: place.primaryCategory,
    status: place.status,
    note: place.note,
  };
}

const demoSharedTripDetail: SharedTripDetail = {
  shareLink: {
    id: "demo-share-link",
    token: "demo",
    permission: "read_only",
  },
  trip: {
    id: "demo-trip",
    title: "교토 & 오사카 봄 여행",
    startDate: "2026-04-17",
    endDate: "2026-04-20",
    visibility: "private",
  },
  savedPlaceHighlights: [
    {
      id: "saved-fushimi",
      provider: "google_places",
      providerPlaceId: "google:fushimi-inari",
      name: "후시미 이나리 신사",
      formattedAddress: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto",
      city: "교토",
      region: "교토부",
      countryCode: "JP",
      latitude: 34.9671,
      longitude: 135.7727,
      googleMapsUri: "https://maps.google.com/?q=Fushimi+Inari+Taisha",
      photoUrl: null,
      primaryCategory: "명소",
      status: "wishlist",
      note: "오전 첫 코스로 넣고 싶은 대표 장소",
    },
    {
      id: "saved-gion",
      provider: "google_places",
      providerPlaceId: "google:gion-nightwalk",
      name: "기온 거리",
      formattedAddress: "Gionmachi Kitagawa, Higashiyama Ward, Kyoto",
      city: "교토",
      region: "교토부",
      countryCode: "JP",
      latitude: 35.0037,
      longitude: 135.7788,
      googleMapsUri: "https://maps.google.com/?q=Gion+Kyoto",
      photoUrl: null,
      primaryCategory: "산책",
      status: "favorite",
      note: "해 질 무렵에 걷기 좋은 구간",
    },
    {
      id: "saved-dotonbori",
      provider: "google_places",
      providerPlaceId: "google:dotonbori",
      name: "도톤보리",
      formattedAddress: "Dotonbori, Chuo Ward, Osaka",
      city: "오사카",
      region: "오사카부",
      countryCode: "JP",
      latitude: 34.6687,
      longitude: 135.5013,
      googleMapsUri: "https://maps.google.com/?q=Dotonbori+Osaka",
      photoUrl: null,
      primaryCategory: "먹거리",
      status: "visited",
      note: "야간 사진과 길거리 음식 둘 다 챙기기",
    },
  ],
  tripDays: [
    {
      id: "day-1",
      tripId: "demo-trip",
      dayNumber: 1,
      tripDate: "2026-04-17",
      items: [
        {
          id: "item-1",
          tripDayId: "day-1",
          savedPlaceId: "saved-fushimi",
          sortOrder: 0,
          note: "교토 첫날 오전에 바로 이동",
          savedPlace: {
            id: "saved-fushimi",
            provider: "google_places",
            providerPlaceId: "google:fushimi-inari",
            name: "후시미 이나리 신사",
            formattedAddress: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto",
            city: "교토",
            region: "교토부",
            countryCode: "JP",
            latitude: 34.9671,
            longitude: 135.7727,
            googleMapsUri: "https://maps.google.com/?q=Fushimi+Inari+Taisha",
            photoUrl: null,
            primaryCategory: "명소",
            status: "wishlist",
            note: "오전 첫 코스로 넣고 싶은 대표 장소",
          },
        },
        {
          id: "item-2",
          tripDayId: "day-1",
          savedPlaceId: "saved-gion",
          sortOrder: 1,
          note: "해 질 무렵 산책으로 마무리",
          savedPlace: {
            id: "saved-gion",
            provider: "google_places",
            providerPlaceId: "google:gion-nightwalk",
            name: "기온 거리",
            formattedAddress: "Gionmachi Kitagawa, Higashiyama Ward, Kyoto",
            city: "교토",
            region: "교토부",
            countryCode: "JP",
            latitude: 35.0037,
            longitude: 135.7788,
            googleMapsUri: "https://maps.google.com/?q=Gion+Kyoto",
            photoUrl: null,
            primaryCategory: "산책",
            status: "favorite",
            note: "해 질 무렵에 걷기 좋은 구간",
          },
        },
      ],
    },
    {
      id: "day-2",
      tripId: "demo-trip",
      dayNumber: 2,
      tripDate: "2026-04-18",
      items: [
        {
          id: "item-3",
          tripDayId: "day-2",
          savedPlaceId: "saved-dotonbori",
          sortOrder: 0,
          note: "오사카 이동 후 저녁 메인 동선",
          savedPlace: {
            id: "saved-dotonbori",
            provider: "google_places",
            providerPlaceId: "google:dotonbori",
            name: "도톤보리",
            formattedAddress: "Dotonbori, Chuo Ward, Osaka",
            city: "오사카",
            region: "오사카부",
            countryCode: "JP",
            latitude: 34.6687,
            longitude: 135.5013,
            googleMapsUri: "https://maps.google.com/?q=Dotonbori+Osaka",
            photoUrl: null,
            primaryCategory: "먹거리",
            status: "visited",
            note: "야간 사진과 길거리 음식 둘 다 챙기기",
          },
        },
      ],
    },
  ],
};

export async function getSharedTripDetail(token: string): Promise<SharedTripDetail | null> {
  if (token === "demo") {
    return demoSharedTripDetail;
  }

  const supabase = createSupabaseAdminClient();
  const { data: shareLinkRow, error: shareLinkError } = await supabase
    .from("share_links")
    .select("*")
    .eq("token", token)
    .single();

  if (shareLinkError || !shareLinkRow) {
    return null;
  }

  const { data: tripRow, error: tripError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", shareLinkRow.trip_id)
    .single();

  if (tripError || !tripRow) {
    return null;
  }

  const { data: tripDayRows, error: tripDaysError } = await supabase
    .from("trip_days")
    .select("*")
    .eq("trip_id", shareLinkRow.trip_id)
    .order("day_number", { ascending: true });

  if (tripDaysError) {
    return null;
  }

  const tripDays = Array.isArray(tripDayRows)
    ? tripDayRows.map((row) => serializeTripDay(row))
    : [];

  const { data: itineraryRows, error: itineraryError } =
    tripDays.length > 0
      ? await supabase
          .from("itinerary_items")
          .select("*")
          .in(
            "trip_day_id",
            tripDays.map((day) => day.id),
          )
          .order("sort_order", { ascending: true })
      : { data: [], error: null };

  if (itineraryError) {
    return null;
  }

  const itineraryItems = Array.isArray(itineraryRows)
    ? itineraryRows.map((row) => serializeItineraryItem(row))
    : [];

  const savedPlaceIds = Array.from(
    new Set(itineraryItems.map((item) => item.savedPlaceId)),
  );
  const { data: savedPlaceRows, error: savedPlacesError } =
    savedPlaceIds.length > 0
      ? await supabase.from("saved_places").select("*").in("id", savedPlaceIds)
      : { data: [], error: null };

  if (savedPlacesError) {
    return null;
  }

  const sharedPlaceMap = new Map(
    (Array.isArray(savedPlaceRows) ? savedPlaceRows : [])
      .map((row) => toSharedPlace(serializeSavedPlace(row)))
      .map((place) => [place.id, place]),
  );

  const publicTripDays: SharedTripDayRecord[] = tripDays.map((day) => ({
    id: day.id,
    tripId: day.tripId,
    dayNumber: day.dayNumber,
    tripDate: day.tripDate,
    items: itineraryItems
      .filter((item) => item.tripDayId === day.id)
      .map((item) => ({
        id: item.id,
        tripDayId: item.tripDayId,
        savedPlaceId: item.savedPlaceId,
        sortOrder: item.sortOrder,
        note: item.note,
        savedPlace: sharedPlaceMap.get(item.savedPlaceId),
      })),
  }));

  const trip = serializeTrip(tripRow);

  return {
    shareLink: {
      id: String(shareLinkRow.id),
      token: String(shareLinkRow.token),
      permission: shareLinkRow.permission as ShareLinkPermission,
    },
    trip: {
      id: trip.id,
      title: trip.title,
      startDate: trip.startDate,
      endDate: trip.endDate,
      visibility: "private",
    },
    tripDays: publicTripDays,
    savedPlaceHighlights: savedPlaceIds
      .map((savedPlaceId) => sharedPlaceMap.get(savedPlaceId))
      .filter((place): place is SharedPlaceRecord => Boolean(place)),
  };
}
