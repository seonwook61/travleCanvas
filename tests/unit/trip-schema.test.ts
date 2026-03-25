import { describe, expect, it } from "vitest";

import { shareLinkCreateSchema } from "@/lib/validation/share-link";
import { tripCreateSchema } from "@/lib/validation/trip";

describe("tripCreateSchema", () => {
  it("accepts a trip create payload with title and dates", () => {
    const payload = {
      title: "간사이 봄 여행",
      startDate: "2026-04-17",
      endDate: "2026-04-20",
    };

    const result = tripCreateSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("rejects an end date that is before the start date", () => {
    const payload = {
      title: "교토 재방문",
      startDate: "2026-04-20",
      endDate: "2026-04-17",
    };

    const result = tripCreateSchema.safeParse(payload);

    expect(result.success).toBe(false);
  });
});

describe("shareLinkCreateSchema", () => {
  it("locks share links to explicit read-only creation", () => {
    const payload = {
      tripId: "ab39598d-f57f-4486-9caa-c74250c76093",
      permission: "read_only",
    };

    const result = shareLinkCreateSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("rejects unsupported share permissions", () => {
    const payload = {
      tripId: "ab39598d-f57f-4486-9caa-c74250c76093",
      permission: "edit",
    };

    const result = shareLinkCreateSchema.safeParse(payload);

    expect(result.success).toBe(false);
  });
});
