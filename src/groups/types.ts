import { z } from "zod";
import { userIdBodySchema } from "./schemas/commonSchema";

export type GroupIdParam = { groupId: string };
export type UserIdBody = z.infer<typeof userIdBodySchema>;
