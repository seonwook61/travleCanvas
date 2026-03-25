import { describe, expect, it } from "vitest";

import { savedPlaceSchema } from "@/lib/validation/saved-place";

describe("savedPlaceSchema", () => {
  it("accepts the locked saved place statuses", () => {
    const payload = {
      providerPlaceId: "google:place_123",
      name: "후시미 이나리 신사",
      formattedAddress: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto",
      city: "교토",
      region: "교토부",
      countryCode: "JP",
      latitude: 34.9671,
      longitude: 135.7727,
      status: "wishlist",
      note: "아침 일찍 가고 싶다.",
    };

    const result = savedPlaceSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("rejects unsupported statuses", () => {
    const payload = {
      providerPlaceId: "google:place_123",
      name: "후시미 이나리 신사",
      formattedAddress: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto",
      city: "교토",
      region: "교토부",
      countryCode: "JP",
      latitude: 34.9671,
      longitude: 135.7727,
      status: "archived",
      note: "이 값은 허용되지 않는다.",
    };

    const result = savedPlaceSchema.safeParse(payload);

    expect(result.success).toBe(false);
  });
});
