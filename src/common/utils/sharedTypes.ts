import { z } from "zod";

export const UUIDSchema = z.object({
  id: z.string().uuid(),
});

export type UUID = z.infer<typeof UUIDSchema>;
