import { z } from "zod";

export const exchangeRateResponseSchema = z.object({
  result: z.string(),
  documentation: z.string(),
  terms_of_use: z.string(),
  time_last_update_unix: z.number(),
  time_last_update_utc: z.string(),
  time_next_update_unix: z.number(),
  time_next_update_utc: z.string(),
  base_code: z.string(),
  conversion_rates: z.record(z.number()),
});

export type ExchangeRateResponse = z.infer<typeof exchangeRateResponseSchema>;

export const getExpensesTotalRequestQuerySchema = z.object({
  targetCurrency: z.string(),
});

export type GetExpensesTotalRequestQuery = z.infer<
  typeof getExpensesTotalRequestQuerySchema
>;
