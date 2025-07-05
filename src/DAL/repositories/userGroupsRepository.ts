import * as dataManager from "../connectionManager";

import { logger } from "../../common/logger/logger-wrapper";
import { DataSource, Repository } from "typeorm";
import { Group, NewGroup } from "../../groups/schemas/groupSchema";
import { UserGroupsEntity } from "../entity/userGroupsEntity";
import { container, inject, injectable, singleton } from "tsyringe";
import { GroupRole, UserGroupStatus } from "../../groups/constants/groupConsts";
import { SERVICES } from "../../common/constants";
import {
  AppError,
  ResourceNotFoundError,
  UserGroupError,
} from "../../common/errors/error-types";

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
        throw new ResourceNotFoundError("User group not found");
      }

      return updatedUserGroup;
    } catch (err) {
      logger.error({
        msg: `Error updating user group status: ${err.message}`,
        metadata: { userId, groupId, status },
      });
      if (err instanceof ResourceNotFoundError) {
        throw err;
      }
      throw new UserGroupError(
        `Error updating user group status: ${err.message}`
      );
    }
  }

  public async insertUserToGroup(
    userId: string,
    groupId: string
  ): Promise<void> {
    try {
      logger.debug({
        msg: "Inserting new user group",
        metadata: { userId, groupId },
      });

      const savedUserGroup = await this.save({
        user: { id: userId },
        group: { id: groupId },
        joinedAt: new Date(),
      });

      logger.debug({
        msg: "User group inserted",
        metadata: { savedUserGroup },
      });
    } catch (err) {
      throw new UserGroupError(`Error inserting user to group: ${err.message}`);
    }
  }

  public async IsUserInGroup(
    userId: string,
    groupId: string
  ): Promise<boolean> {
    const userGroup = await this.findOne({
      where: {
        user: { id: userId },
        group: { id: groupId },
        status: UserGroupStatus.ACCEPTED,
      },
    });
    return !!userGroup;
  }

  public async getGroupParticipants(
    groupId: string
  ): Promise<UserGroupsEntity[]> {
    try {
      logger.debug({
        msg: "Getting group participants",
        metadata: { groupId },
      });

      const participants = await this.find({
        where: { group: { id: groupId }, status: UserGroupStatus.ACCEPTED },
        relations: ["user"],
      });

      logger.debug({
        msg: "Group participants retrieved",
        metadata: { count: participants.length },
      });
      return participants;
    } catch (err) {
      logger.error({
        msg: `Error getting group participants: ${err.message}`,
        metadata: { groupId },
      });
      throw new UserGroupError(
        `Error getting group participants: ${err.message}`
      );
    }
  }
}
