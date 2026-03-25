import { describe, expect, it } from "vitest";

import { normalizeGooglePlace } from "@/lib/google-maps/normalize-place";

describe("normalizeGooglePlace", () => {
  it("normalizes a Google Places payload into the app domain shape", () => {
    const place = {
      id: "place_123",
      displayName: { text: "후시미 이나리 신사" },
      formattedAddress: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto, Japan",
      location: {
        latitude: 34.9671,
        longitude: 135.7727,
      },
      addressComponents: [
        { longText: "교토", types: ["locality"] },
        { longText: "교토부", types: ["administrative_area_level_1"] },
        { shortText: "JP", longText: "Japan", types: ["country"] },
      ],
      googleMapsUri: "https://maps.google.com/?cid=place_123",
      primaryTypeDisplayName: { text: "관광명소" },
    };

    const result = normalizeGooglePlace(place);

    expect(result).toEqual({
      provider: "google_places",
      providerPlaceId: "place_123",
      name: "후시미 이나리 신사",
      formattedAddress: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto, Japan",
      city: "교토",
      region: "교토부",
      countryCode: "JP",
      latitude: 34.9671,
      longitude: 135.7727,
      googleMapsUri: "https://maps.google.com/?cid=place_123",
      photoUrl: null,
      primaryCategory: "관광명소",
    });
  });

  it("preserves Japan city and region metadata when locality is missing", () => {
    const place = {
      id: "place_456",
      displayName: { text: "도톤보리" },
      formattedAddress: "Dotonbori, Chuo Ward, Osaka, Japan",
      location: {
        latitude: 34.6687,
        longitude: 135.5013,
      },
      addressComponents: [
        { longText: "주오구", types: ["sublocality", "political"] },
        { longText: "오사카", types: ["administrative_area_level_2"] },
        { longText: "오사카부", types: ["administrative_area_level_1"] },
        { shortText: "JP", longText: "Japan", types: ["country"] },
      ],
      googleMapsUri: "https://maps.google.com/?cid=place_456",
    };

    const result = normalizeGooglePlace(place);

    expect(result.city).toBe("오사카");
    expect(result.region).toBe("오사카부");
    expect(result.countryCode).toBe("JP");
  });
});
