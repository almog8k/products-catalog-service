import { z, ZodType } from "zod";
import { timeRecordSchema } from "../../common/schemas/date.schema";
import { GroupEntity } from "../../DAL/entity/groupEntity";
import { UserGroupStatus } from "../constants/groupConsts";
import { UserGroupsEntity } from "../../DAL/entity/userGroupsEntity";

export const groupTypeSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
  })
  .merge(timeRecordSchema);

export type GroupCategory = z.infer<typeof groupTypeSchema>;

export const groupSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    type: groupTypeSchema,
  })
  .merge(timeRecordSchema);

export type Group = z.infer<typeof groupSchema>;

export const groupWithStatusSchema = groupSchema.extend({
  userStatus: z.nativeEnum(UserGroupStatus),
});

export type GroupWithStatus = z.infer<typeof groupWithStatusSchema>;

export const newGroupSchema = groupSchema
  .pick({ name: true })
  .extend({
    typeId: z.string().uuid(),
  })
  .describe("NewGroup");

export type NewGroup = z.infer<typeof newGroupSchema>;

export const updateUserGroupStatusReqSchema = z.object({
  status: z.nativeEnum(UserGroupStatus),
});

export type UpdateUserGroupStatusReq = z.infer<
  typeof updateUserGroupStatusReqSchema
>;

export type UpdateUserGroupStatusRes = {
  groupId: string;
  status: UserGroupStatus;
};
