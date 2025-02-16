import { z } from "zod";

export const uuidSchema = z.string().uuid().describe("UserID");

export const timeZoneHeaderSchema = z.object({
  "time-zone": z.string().optional(),
});

export const userIdHeaderSchema = z.object({
  "user-id": uuidSchema,
});

export const headersSchema = z
  .object({})
  .merge(timeZoneHeaderSchema)
  .merge(userIdHeaderSchema);

type x = z.infer<typeof headersSchema>;
