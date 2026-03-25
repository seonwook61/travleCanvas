import { z } from "zod";

import { savedPlaceStatusValues } from "@/lib/types/domain";

export const savedPlaceStatusSchema = z.enum(savedPlaceStatusValues);

export const savedPlaceSchema = z.object({
  providerPlaceId: z.string().min(1),
  name: z.string().min(1),
  formattedAddress: z.string().min(1),
  city: z.string().min(1),
  region: z.string().min(1),
  countryCode: z.string().length(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  status: savedPlaceStatusSchema,
  note: z.string().trim().max(280).nullable().optional(),
  googleMapsUri: z.string().url().nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  primaryCategory: z.string().trim().max(80).nullable().optional(),
});

export type SavedPlaceInput = z.infer<typeof savedPlaceSchema>;
