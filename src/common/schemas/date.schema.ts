import { z } from "zod";
import { TimeRecordEntity } from "../../DAL/entity/timeRecordEntity";

export const timeRecordSchema = z.object({
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
