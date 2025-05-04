import { z } from "zod";

export const timeRecordSchema = z.object({
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
