import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireUserMock, createSupabaseAdminClientMock } = vi.hoisted(() => ({
  requireUserMock: vi.fn(),
  createSupabaseAdminClientMock: vi.fn(),
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

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: createSupabaseAdminClientMock,
}));

describe("share links api", () => {
  beforeEach(() => {
    requireUserMock.mockReset();
    createSupabaseAdminClientMock.mockReset();
  });

  it("requires auth to create a share link", async () => {
    const { AuthRequiredError } = await import("@/lib/auth/require-user");
    requireUserMock.mockRejectedValueOnce(new AuthRequiredError());

    const { POST } = await import("../../app/api/trips/[tripId]/share-links/route");
    const request = new Request("http://localhost:3000/api/trips/trip_1/share-links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tripId: "4a94098e-a114-4c5e-8d2c-a22414d6d7b9",
        permission: "read_only",
      }),
    });

    const response = await POST(request, {
      params: Promise.resolve({ tripId: "4a94098e-a114-4c5e-8d2c-a22414d6d7b9" }),
    });

    expect(response.status).toBe(401);
  });

  it("creates an explicit read-only share link", async () => {
    const insert = vi.fn(() => ({
      select: () => ({
        single: async () => ({
          data: {
            id: "9918f8ba-aa4e-4adf-aa14-e866cc728dd9",
            trip_id: "4a94098e-a114-4c5e-8d2c-a22414d6d7b9",
            token: "share-token-123",
            permission: "read_only",
            created_by: "user_1",
            created_at: "2026-03-25T00:00:00.000Z",
          },
          error: null,
        }),
      }),
    }));

    requireUserMock.mockResolvedValueOnce({
      user: { id: "user_1" },
      supabase: {
        from: (table: string) => {
          if (table === "share_links") {
            return { insert };
          }

          return { insert: vi.fn() };
        },
      },
    });

    const { POST } = await import("../../app/api/trips/[tripId]/share-links/route");
    const request = new Request("http://localhost:3000/api/trips/trip_1/share-links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tripId: "4a94098e-a114-4c5e-8d2c-a22414d6d7b9",
        permission: "read_only",
      }),
    });

    const response = await POST(request, {
      params: Promise.resolve({ tripId: "4a94098e-a114-4c5e-8d2c-a22414d6d7b9" }),
    });
    const payload = (await response.json()) as {
      shareLink?: { permission: string; token: string };
    };

    expect(response.status).toBe(201);
    expect(insert).toHaveBeenCalledTimes(1);
    expect(payload.shareLink?.permission).toBe("read_only");
    expect(payload.shareLink?.token).toBe("share-token-123");
  });

  it("returns a public read-only trip model for a valid token", async () => {
    const adminClient = {
      from: (table: string) => {
        if (table === "share_links") {
          return {
            select: () => ({
              eq: () => ({
                single: async () => ({
                  data: {
                    id: "share_1",
                    trip_id: "trip_1",
                    token: "share-token-123",
                    permission: "read_only",
                  },
                  error: null,
                }),
              }),
            }),
          };
        }

        if (table === "trips") {
          return {
            select: () => ({
              eq: () => ({
                single: async () => ({
                  data: {
                    id: "trip_1",
                    title: "교토 & 오사카 봄 여행",
                    start_date: "2026-04-17",
                    end_date: "2026-04-20",
                  },
                  error: null,
                }),
              }),
            }),
          };
        }

        if (table === "trip_days") {
          return {
            select: () => ({
              eq: () => ({
                order: async () => ({
                  data: [
                    {
                      id: "day_1",
                      trip_id: "trip_1",
                      day_number: 1,
                      trip_date: "2026-04-17",
                    },
                  ],
                  error: null,
                }),
              }),
            }),
          };
        }

        if (table === "itinerary_items") {
          return {
            select: () => ({
              in: () => ({
                order: async () => ({
                  data: [
                    {
                      id: "item_1",
                      trip_day_id: "day_1",
                      saved_place_id: "saved_1",
                      sort_order: 0,
                      note: "교토 첫날 오후",
                    },
                  ],
                  error: null,
                }),
              }),
            }),
          };
        }

        if (table === "saved_places") {
          return {
            select: () => ({
              in: async () => ({
                data: [
                  {
                    id: "saved_1",
                    user_id: "user_1",
                    provider_place_id: "google:place_123",
                    name: "후시미 이나리 신사",
                    formatted_address: "Kyoto",
                    city: "교토",
                    region: "교토부",
                    country_code: "JP",
                    latitude: 34.9671,
                    longitude: 135.7727,
                    status: "wishlist",
                    note: "아침 추천",
                    created_at: "2026-03-25T00:00:00.000Z",
                    updated_at: "2026-03-25T00:00:00.000Z",
                  },
                ],
                error: null,
              }),
            }),
          };
        }

        return {
          select: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        };
      },
    };

    createSupabaseAdminClientMock.mockReturnValue(adminClient);

    const { GET } = await import("../../app/api/shared/trips/[token]/route");
    const response = await GET(new Request("http://localhost:3000/api/shared/trips/share-token-123"), {
      params: Promise.resolve({ token: "share-token-123" }),
    });
    const payload = (await response.json()) as {
      trip?: { title: string };
      tripDays?: { dayNumber: number }[];
      savedPlaceHighlights?: { name: string }[];
    };

    expect(response.status).toBe(200);
    expect(payload.trip?.title).toBe("교토 & 오사카 봄 여행");
    expect(payload.tripDays?.[0]?.dayNumber).toBe(1);
    expect(payload.savedPlaceHighlights?.[0]?.name).toBe("후시미 이나리 신사");
  });

  it("returns 404 for an invalid token", async () => {
    createSupabaseAdminClientMock.mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: null,
              error: { message: "not found" },
            }),
          }),
        }),
      }),
    });

    const { GET } = await import("../../app/api/shared/trips/[token]/route");
    const response = await GET(new Request("http://localhost:3000/api/shared/trips/missing-token"), {
      params: Promise.resolve({ token: "missing-token" }),
    });

    expect(response.status).toBe(404);
  });
});
