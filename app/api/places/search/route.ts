import { NextRequest, NextResponse } from "next/server";

import { getGoogleMapsServerEnv } from "@/lib/env";
import {
  normalizeGooglePlace,
  type GooglePlacePayload,
} from "@/lib/google-maps/normalize-place";
import type { NormalizedPlaceResult } from "@/lib/types/domain";

const FALLBACK_PLACES: NormalizedPlaceResult[] = [
  {
    provider: "google_places",
    providerPlaceId: "fallback-tokyo-skytree",
    name: "도쿄 스카이트리",
    formattedAddress: "1 Chome-1-2 Oshiage, Sumida City, Tokyo, Japan",
    city: "도쿄",
    region: "도쿄도",
    countryCode: "JP",
    latitude: 35.7101,
    longitude: 139.8107,
    googleMapsUri: "https://maps.google.com/?q=Tokyo+Skytree",
    photoUrl: null,
    primaryCategory: "전망대",
  },
  {
    provider: "google_places",
    providerPlaceId: "fallback-teamlab-planets",
    name: "teamLab Planets TOKYO",
    formattedAddress: "6 Chome-1-16 Toyosu, Koto City, Tokyo, Japan",
    city: "도쿄",
    region: "도쿄도",
    countryCode: "JP",
    latitude: 35.6491,
    longitude: 139.7899,
    googleMapsUri: "https://maps.google.com/?q=teamLab+Planets+TOKYO",
    photoUrl: null,
    primaryCategory: "미디어아트",
  },
  {
    provider: "google_places",
    providerPlaceId: "fallback-dotonbori",
    name: "도톤보리",
    formattedAddress: "Dotonbori, Chuo Ward, Osaka, Japan",
    city: "오사카",
    region: "오사카부",
    countryCode: "JP",
    latitude: 34.6687,
    longitude: 135.5013,
    googleMapsUri: "https://maps.google.com/?q=Dotonbori",
    photoUrl: null,
    primaryCategory: "거리",
  },
  {
    provider: "google_places",
    providerPlaceId: "fallback-osaka-castle",
    name: "오사카성",
    formattedAddress: "1-1 Osakajo, Chuo Ward, Osaka, Japan",
    city: "오사카",
    region: "오사카부",
    countryCode: "JP",
    latitude: 34.6873,
    longitude: 135.5259,
    googleMapsUri: "https://maps.google.com/?q=Osaka+Castle",
    photoUrl: null,
    primaryCategory: "성곽",
  },
  {
    provider: "google_places",
    providerPlaceId: "fallback-fushimi-inari",
    name: "후시미 이나리 신사",
    formattedAddress: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto, Japan",
    city: "교토",
    region: "교토부",
    countryCode: "JP",
    latitude: 34.9671,
    longitude: 135.7727,
    googleMapsUri: "https://maps.google.com/?q=Fushimi+Inari+Taisha",
    photoUrl: null,
    primaryCategory: "신사",
  },
  {
    provider: "google_places",
    providerPlaceId: "fallback-arashiyama",
    name: "아라시야마 대나무 숲",
    formattedAddress: "Sagaogurayama Tabuchiyamacho, Ukyo Ward, Kyoto, Japan",
    city: "교토",
    region: "교토부",
    countryCode: "JP",
    latitude: 35.017,
    longitude: 135.6713,
    googleMapsUri: "https://maps.google.com/?q=Arashiyama+Bamboo+Forest",
    photoUrl: null,
    primaryCategory: "자연명소",
  },
];

function buildTextQuery(q: string, city: string, region: string) {
  return [q, city, region, "Japan"].filter(Boolean).join(" ").trim();
}

function searchFallbackPlaces(q: string, city: string) {
  const normalizedQuery = q.trim().toLowerCase();
  const normalizedCity = city.trim().toLowerCase();

  const filtered = FALLBACK_PLACES.filter((place) => {
    const matchesCity =
      !normalizedCity ||
      place.city.toLowerCase().includes(normalizedCity) ||
      place.region.toLowerCase().includes(normalizedCity);
    const matchesQuery =
      !normalizedQuery ||
      place.name.toLowerCase().includes(normalizedQuery) ||
      place.formattedAddress.toLowerCase().includes(normalizedQuery) ||
      (place.primaryCategory ?? "").toLowerCase().includes(normalizedQuery);

    return matchesCity && matchesQuery;
  });

  if (filtered.length > 0) {
    return filtered.slice(0, 8);
  }

  if (normalizedCity) {
    return FALLBACK_PLACES.filter((place) => place.city.toLowerCase().includes(normalizedCity)).slice(
      0,
      8,
    );
  }

  return FALLBACK_PLACES.slice(0, 8);
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const city = request.nextUrl.searchParams.get("city")?.trim() ?? "";
  const region = request.nextUrl.searchParams.get("region")?.trim() ?? "";

  try {
    const { apiKey } = getGoogleMapsServerEnv();
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.addressComponents,places.location,places.googleMapsUri,places.primaryTypeDisplayName",
      },
      body: JSON.stringify({
        textQuery: buildTextQuery(q, city, region),
        languageCode: "ko",
        regionCode: "JP",
        pageSize: 8,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to search Google Places");
    }

    const payload = (await response.json()) as {
      places?: unknown[];
    };
    const items = Array.isArray(payload.places)
      ? (payload.places as GooglePlacePayload[])
          .map((place) => normalizeGooglePlace(place))
          .filter((place) => place.name)
      : [];

    if (items.length > 0) {
      return NextResponse.json({
        items,
        meta: {
          source: "google",
          query: q,
          city: city || null,
          region: region || null,
        },
      });
    }
  } catch {
    // If the server key is missing or Google returns an error, fall back to curated data.
  }

  return NextResponse.json({
    items: searchFallbackPlaces(q, city),
    meta: {
      source: "fallback",
      query: q,
      city: city || null,
      region: region || null,
    },
  });
}
