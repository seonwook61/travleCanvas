import { z } from "zod";

import { shareLinkPermissionValues } from "@/lib/types/domain";

export const shareLinkCreateSchema = z.object({
  tripId: z.string().uuid(),
  permission: z.enum(shareLinkPermissionValues),
});

export type ShareLinkCreateInput = z.infer<typeof shareLinkCreateSchema>;
