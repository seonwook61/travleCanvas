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

describe("trips api", () => {
  beforeEach(() => {
    requireUserMock.mockReset();
  });

  it("requires auth to create a trip", async () => {
    const { AuthRequiredError } = await import("@/lib/auth/require-user");
    requireUserMock.mockRejectedValueOnce(new AuthRequiredError());

    const { POST } = await import("../../app/api/trips/route");
    const request = new Request("http://localhost:3000/api/trips", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "간사이 봄 여행",
        startDate: "2026-04-17",
        endDate: "2026-04-20",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });

  it("creates an inclusive date-based trip with generated trip days", async () => {
    const tripInsert = vi.fn(() => ({
      select: () => ({
        single: async () => ({
          data: {
            id: "trip_1",
            user_id: "user_1",
            title: "간사이 봄 여행",
            start_date: "2026-04-17",
            end_date: "2026-04-20",
            visibility: "private",
            created_at: "2026-03-25T00:00:00.000Z",
            updated_at: "2026-03-25T00:00:00.000Z",
          },
          error: null,
        }),
      }),
    }));
    const tripDaysInsert = vi.fn((rows: unknown[]) => ({
      select: async () => ({
        data: rows,
        error: null,
      }),
    }));

    requireUserMock.mockResolvedValueOnce({
      user: { id: "user_1" },
      supabase: {
        from: (table: string) => {
          if (table === "trips") {
            return { insert: tripInsert };
          }

          if (table === "trip_days") {
            return { insert: tripDaysInsert };
          }

          return { insert: vi.fn() };
        },
      },
    });

    const { POST } = await import("../../app/api/trips/route");
    const request = new Request("http://localhost:3000/api/trips", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "간사이 봄 여행",
        startDate: "2026-04-17",
        endDate: "2026-04-20",
      }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as {
      trip?: { visibility: string };
      tripDays?: { trip_date: string; day_number: number }[];
    };

    expect(response.status).toBe(201);
    expect(tripInsert).toHaveBeenCalledTimes(1);
    expect(tripDaysInsert).toHaveBeenCalledWith([
      { trip_id: "trip_1", day_number: 1, trip_date: "2026-04-17" },
      { trip_id: "trip_1", day_number: 2, trip_date: "2026-04-18" },
      { trip_id: "trip_1", day_number: 3, trip_date: "2026-04-19" },
      { trip_id: "trip_1", day_number: 4, trip_date: "2026-04-20" },
    ]);
    expect(payload.trip?.visibility).toBe("private");
    expect(payload.tripDays).toHaveLength(4);
  });

  it("places a saved place into a trip day", async () => {
    const itineraryInsert = vi.fn((row: unknown) => ({
      select: () => ({
        single: async () => ({
          data: {
            id: "9f99a8e6-d57f-420a-b91d-b7f64b2350f8",
            trip_day_id: "ffab2bc9-f35c-4f54-9c3c-79342383deeb",
            saved_place_id: "98febca5-caf4-4904-8f0b-3f86b5a1e126",
            sort_order: 0,
            note: "첫날 오후에 가기",
            ...((row as Record<string, unknown>) ?? {}),
          },
          error: null,
        }),
      }),
    }));
    const itineraryLatestItem = {
      maybeSingle: async () => ({
        data: { sort_order: 2 },
        error: null,
      }),
    };
    const itinerarySelect = {
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => itineraryLatestItem),
        })),
      })),
    };
    const tripDaySingle = {
      single: async () => ({
        data: {
          id: "ffab2bc9-f35c-4f54-9c3c-79342383deeb",
          trip_id: "trip_1",
        },
        error: null,
      }),
    };
    const savedPlaceSingle = {
      single: async () => ({
        data: { id: "98febca5-caf4-4904-8f0b-3f86b5a1e126" },
        error: null,
      }),
    };

    requireUserMock.mockResolvedValueOnce({
      user: { id: "user_1" },
      supabase: {
        from: (table: string) => {
          if (table === "trip_days") {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  eq: vi.fn(() => tripDaySingle),
                })),
              })),
            };
          }

          if (table === "saved_places") {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  eq: vi.fn(() => savedPlaceSingle),
                })),
              })),
            };
          }

          if (table === "itinerary_items") {
            return {
              select: vi.fn(() => itinerarySelect),
              insert: itineraryInsert,
            };
          }

          return { insert: vi.fn() };
        },
      },
    });

    const { POST } = await import("../../app/api/trips/[tripId]/itinerary-items/route");
    const request = new Request(
      "http://localhost:3000/api/trips/trip_1/itinerary-items",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tripDayId: "ffab2bc9-f35c-4f54-9c3c-79342383deeb",
          savedPlaceId: "98febca5-caf4-4904-8f0b-3f86b5a1e126",
          note: "첫날 오후에 가기",
        }),
      },
    );

    const response = await POST(request, {
      params: Promise.resolve({ tripId: "trip_1" }),
    });
    const payload = (await response.json()) as {
      item?: { savedPlaceId: string; note: string | null };
    };

    expect(response.status).toBe(201);
    expect(itineraryInsert).toHaveBeenCalledTimes(1);
    expect(itineraryInsert).toHaveBeenCalledWith({
      trip_day_id: "ffab2bc9-f35c-4f54-9c3c-79342383deeb",
      saved_place_id: "98febca5-caf4-4904-8f0b-3f86b5a1e126",
      sort_order: 3,
      note: "첫날 오후에 가기",
    });
    expect(payload.item?.savedPlaceId).toBe("98febca5-caf4-4904-8f0b-3f86b5a1e126");
    expect(payload.item?.note).toBe("첫날 오후에 가기");
  });
});
