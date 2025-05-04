import { z } from "zod";

export const uuidSchema = z.string().uuid().describe("UserID");

export const timeZoneHeaderSchema = z.object({
  "time-zone": z.string().optional(),
});

export const currencySchema = z.string().length(3).describe("Currency");
