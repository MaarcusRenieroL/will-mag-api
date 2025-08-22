import { z } from "zod";

import type { Award } from "@/generated/prisma/index.js";

export const AwardSchema = z.object({
  id: z.string(),
  name: z.string({ message: "award name is required" }).min(1).openapi({
    example: "Best Performance",
  }),
  icon: z.string({ message: "award icon is required" }).min(1).openapi({
    example: "🏆",
  }),
  contestId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Award>;

export const AwardInsertSchema = AwardSchema.omit({
  id: true,
  contestId: true,
  createdAt: true,
  updatedAt: true,
});

export const AwardSelectSchema = AwardSchema;
