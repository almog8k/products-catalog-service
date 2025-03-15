import { container } from "tsyringe";
import { logger } from "../../common/logger/logger-wrapper";
import {
  Group,
  NewGroup,
  UpdateUserGroupStatusRes,
} from "../schemas/groupSchema";
import { GroupRepository } from "../../DAL/repositories/groupRepository";
import { GroupCategoryRepository } from "../../DAL/repositories/groupTypesRepository";
import { UserGroupStatus } from "../constants/groupConsts";
import { UserGroupsRepository } from "../../DAL/repositories/userGroupsRepository";

export const getGroupTypes = async () => {
  logger.info({ msg: "Getting all group types." });
  const repo = container.resolve(GroupCategoryRepository);
  const categories = await repo.getGroupTypes();
  logger.debug({ msg: "Group types found.", metadata: { categories } });
  return categories;
};

export const createGroup = async (
  newGroup: NewGroup,
  userId: string
): Promise<Group> => {
  const repo = container.resolve(GroupRepository);
  const group = await repo.createGroup(newGroup, userId);
  return group;
};

export const getGroupsByUserId = async (userId: string): Promise<Group[]> => {
  const userGroupFilter = [UserGroupStatus.ACCEPTED, UserGroupStatus.PENDING];
  const repo = container.resolve(GroupRepository);
  const groups = await repo.getGroupsByUserId(userId, userGroupFilter);
  logger.debug({ msg: "Groups found.", metadata: { groups } });
  return groups;
};

export const updateUserGroupStatus = async (
  userId: string,
  groupId: string,
  status: UserGroupStatus
): Promise<UpdateUserGroupStatusRes> => {
  logger.info({
    msg: "Updating user group status.",
    metadata: { userId, groupId, status },
  });
  const repo = container.resolve(UserGroupsRepository);
  const groupWithStatus = await repo.updateUsersGroupStatus(
    userId,
    groupId,
    status
  );
  return {
    groupId: groupWithStatus.group.id,
    status: groupWithStatus.status,
  };
};
