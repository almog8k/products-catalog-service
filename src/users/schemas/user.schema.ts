import { z } from "zod";

export const simpleUserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
});

export type SimpleUser = z.infer<typeof simpleUserSchema>;
