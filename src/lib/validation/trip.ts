import { z } from "zod";

export const tripCreateSchema = z
  .object({
    title: z.string().trim().min(1).max(80),
    startDate: z.string().date(),
    endDate: z.string().date(),
    selectedPlaceIds: z.array(z.string().uuid()).max(12).optional().default([]),
  })
  .superRefine((value, ctx) => {
    if (value.endDate < value.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "종료일은 시작일보다 빠를 수 없습니다.",
      });
    }
  });

export type TripCreateInput = z.infer<typeof tripCreateSchema>;

export const itineraryItemCreateSchema = z.object({
  tripDayId: z.string().uuid(),
  savedPlaceId: z.string().uuid(),
  note: z.string().trim().max(280).nullable().optional(),
});

export type ItineraryItemCreateInput = z.infer<typeof itineraryItemCreateSchema>;
