import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireUserMock } = vi.hoisted(() => ({
  requireUserMock: vi.fn(),
}));

vi.mock("@/lib/auth/require-user", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth/require-user")>(
    "@/lib/auth/require-user",
  );

  return {
    ...actual,
    requireUser: requireUserMock,
  };
});

describe("saved places route", () => {
  beforeEach(() => {
    requireUserMock.mockReset();
  });

  it("requires auth to save a place", async () => {
    const { AuthRequiredError } = await import("@/lib/auth/require-user");

    requireUserMock.mockRejectedValueOnce(new AuthRequiredError());

    const { POST } = await import("../../app/api/saved-places/route");
    const request = new Request("http://localhost:3000/api/saved-places", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        providerPlaceId: "google:place_123",
        name: "후시미 이나리 신사",
        formattedAddress: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto",
        city: "교토",
        region: "교토부",
        countryCode: "JP",
        latitude: 34.9671,
        longitude: 135.7727,
        status: "wishlist",
      }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { error?: string };

    expect(response.status).toBe(401);
    expect(payload.error).toBeDefined();
  });

  it("accepts a valid place payload", async () => {
    const insertedRow = {
      id: "saved_place_1",
      user_id: "user_1",
      provider: "google_places",
      provider_place_id: "google:place_123",
      name: "후시미 이나리 신사",
      formatted_address: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto",
      city: "교토",
      region: "교토부",
      country_code: "JP",
      latitude: 34.9671,
      longitude: 135.7727,
      google_maps_uri: "https://maps.google.com/?q=Fushimi+Inari+Taisha",
      photo_url: null,
      primary_category: "신사",
      status: "wishlist",
      note: "아침 시간 추천",
      created_at: "2026-03-25T12:00:00.000Z",
      updated_at: "2026-03-25T12:00:00.000Z",
    };

    const insert = vi.fn(() => ({
      select: () => ({
        single: async () => ({ data: insertedRow, error: null }),
      }),
    }));

    requireUserMock.mockResolvedValueOnce({
      user: { id: "user_1" },
      supabase: {
        from: () => ({
          insert,
        }),
      },
    });

    const { POST } = await import("../../app/api/saved-places/route");
    const request = new Request("http://localhost:3000/api/saved-places", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        providerPlaceId: "google:place_123",
        name: "후시미 이나리 신사",
        formattedAddress: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto",
        city: "교토",
        region: "교토부",
        countryCode: "JP",
        latitude: 34.9671,
        longitude: 135.7727,
        status: "wishlist",
        note: "아침 시간 추천",
        googleMapsUri: "https://maps.google.com/?q=Fushimi+Inari+Taisha",
        primaryCategory: "신사",
      }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { item?: { status: string } };

    expect(response.status).toBe(201);
    expect(insert).toHaveBeenCalledTimes(1);
    expect(payload.item?.status).toBe("wishlist");
  });

  it("rejects an invalid status", async () => {
    requireUserMock.mockResolvedValueOnce({
      user: { id: "user_1" },
      supabase: {},
    });

    const { POST } = await import("../../app/api/saved-places/route");
    const request = new Request("http://localhost:3000/api/saved-places", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        providerPlaceId: "google:place_123",
        name: "후시미 이나리 신사",
        formattedAddress: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto",
        city: "교토",
        region: "교토부",
        countryCode: "JP",
        latitude: 34.9671,
        longitude: 135.7727,
        status: "archived",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
