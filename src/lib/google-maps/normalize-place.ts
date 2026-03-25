import type { NormalizedPlaceResult } from "@/lib/types/domain";

interface GoogleAddressComponent {
  longText?: string;
  shortText?: string;
  types?: string[];
}

export interface GooglePlacePayload {
  id?: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  addressComponents?: GoogleAddressComponent[];
  googleMapsUri?: string;
  primaryTypeDisplayName?: {
    text?: string;
  };
}

function findAddressComponent(
  components: GoogleAddressComponent[],
  targetTypes: string[],
  preference: "longText" | "shortText" = "longText",
) {
  const match = components.find((component) =>
    component.types?.some((type) => targetTypes.includes(type)),
  );

  if (!match) {
    return null;
  }

  return match[preference] ?? match.longText ?? match.shortText ?? null;
}

export function normalizeGooglePlace(place: GooglePlacePayload): NormalizedPlaceResult {
  const components = place.addressComponents ?? [];
  const city =
    findAddressComponent(components, ["locality"]) ??
    findAddressComponent(components, ["administrative_area_level_2"]) ??
    findAddressComponent(components, ["sublocality", "sublocality_level_1"]) ??
    "일본";
  const region =
    findAddressComponent(components, ["administrative_area_level_1"]) ?? city;
  const countryCode =
    findAddressComponent(components, ["country"], "shortText") ?? "JP";

  return {
    provider: "google_places",
    providerPlaceId: place.id ?? "",
    name: place.displayName?.text ?? place.formattedAddress ?? "이름 미상",
    formattedAddress: place.formattedAddress ?? "",
    city,
    region,
    countryCode,
    latitude: place.location?.latitude ?? 0,
    longitude: place.location?.longitude ?? 0,
    googleMapsUri: place.googleMapsUri ?? null,
    photoUrl: null,
    primaryCategory: place.primaryTypeDisplayName?.text ?? null,
  };
}
