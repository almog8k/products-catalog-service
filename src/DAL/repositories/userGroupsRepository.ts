import * as dataManager from "../connectionManager";

import { logger } from "../../common/logger/logger-wrapper";
import { DataSource, Repository } from "typeorm";
import { Group, NewGroup } from "../../groups/schemas/groupSchema";
import { UserGroupsEntity } from "../entity/userGroupsEntity";
import { container, inject, injectable, singleton } from "tsyringe";
import { GroupRole, UserGroupStatus } from "../../groups/constants/groupConsts";
import { SERVICES } from "../../common/constants";

@injectable()
export class UserGroupsRepository extends Repository<UserGroupsEntity> {
  constructor(private dataSource: DataSource) {
    super(UserGroupsEntity, dataSource.createEntityManager());
  }

  public async updateUsersGroupStatus(
    userId: string,
    groupId: string,
    status: UserGroupStatus
  ): Promise<UserGroupsEntity> {
    try {
      logger.debug({
        msg: "Updating user group status",
        metadata: { userId, groupId, status },
      });

      await this.update(
        { user: { id: userId }, group: { id: groupId } },
        { status: status }
      );

      const updatedUserGroup = await this.findOne({
        where: { user: { id: userId }, group: { id: groupId } },
        relations: ["user", "group"],
      });

      logger.debug({
        msg: "User group status updated",
        metadata: { userId, groupId, status },
      });
      if (!updatedUserGroup) {
        throw new Error("User group not found");
      }

      return updatedUserGroup;
    } catch (err) {
      logger.error({
        msg: `Error updating user group status: ${err.message}`,
        metadata: { userId, groupId, status },
      });
      throw new Error(`Error updating user group status: ${err.message}`);
    }
  }

  public async insertUserToGroup(
    userId: string,
    groupId: string,
    role: GroupRole,
    status: UserGroupStatus
  ): Promise<void> {
    try {
      logger.debug({
        msg: "Inserting new user group",
        metadata: { userId, groupId, role },
      });

      const savedUserGroup = await this.save({
        user: { id: userId },
        group: { id: groupId },
        role: role,
        joinedAt: new Date(),
      });

      logger.debug({
        msg: "User group inserted",
        metadata: { savedUserGroup },
      });
    } catch (err) {
      throw new Error(`Error inserting user to group: ${err.message}`);
    }
  }
}
