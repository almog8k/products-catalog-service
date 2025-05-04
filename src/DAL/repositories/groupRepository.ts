import * as dataManager from "../connectionManager";

import { logger } from "../../common/logger/logger-wrapper";
import { DataSource, Entity, Repository } from "typeorm";
import { GroupEntity } from "../entity/groupEntity";
import {
  Group,
  GroupWithStatus,
  NewGroup,
} from "../../groups/schemas/groupSchema";
import { inject, injectable } from "tsyringe";
import { UserGroupsRepository } from "./userGroupsRepository";
import "reflect-metadata";
import { GroupRole, UserGroupStatus } from "../../groups/constants/groupConsts";
import {
  AppError,
  ResourceNotFoundError,
} from "../../common/errors/error-types";

@injectable()
export class GroupRepository extends Repository<GroupEntity> {
  constructor(
    private dataSource: DataSource,
    private userGroupsRepository: UserGroupsRepository
  ) {
    super(GroupEntity, dataSource.createEntityManager());
  }

  public async createGroup(group: NewGroup, userId: string): Promise<Group> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      logger.debug({ msg: "Inserting new group", metadata: { group } });
      const newGroup = this.create({
        name: group.name,
        type: { id: group.typeId },
      });

      const savedGroup = await queryRunner.manager.save(newGroup);

      const userGroup = this.userGroupsRepository.create({
        user: { id: userId },
        group: { id: savedGroup.id },
        role: GroupRole.ADMIN,
        status: UserGroupStatus.ACCEPTED,
      });

      await queryRunner.manager.save(userGroup);

      const groupWithType = await queryRunner.manager.findOne(GroupEntity, {
        where: { id: savedGroup.id },
        relations: ["type"],
      });

      if (!groupWithType) {
        throw new ResourceNotFoundError("Group not found");
      }

      await queryRunner.commitTransaction();

      return groupWithType;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof ResourceNotFoundError) {
        throw err;
      }
      throw new AppError(
        "CreatingGroupError",
        `Error creating group: ${err.message}`
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async getGroupsByUserId(
    userId: string,
    statusFilter?: UserGroupStatus | UserGroupStatus[]
  ): Promise<GroupWithStatus[]> {
    logger.debug({
      msg: "Getting all groups by user id",
      metadata: { userId },
    });
    let query = this.createQueryBuilder("group")
      .innerJoin("user_groups", "ug", "ug.group_id = group.id")
      .where("ug.user_id = :userId", { userId })
      .leftJoinAndSelect("group.type", "type")
      .addSelect("ug.status", "userStatus");

    if (statusFilter) {
      if (Array.isArray(statusFilter)) {
        query = query.andWhere("ug.status IN (:...statuses)", {
          statuses: statusFilter,
        });
      } else {
        query = query.andWhere("ug.status = :status", {
          status: statusFilter,
        });
      }
    }

    const groups = query.getRawAndEntities().then((result) => {
      return result.entities.map((entity, index) => {
        return {
          ...entity,
          userStatus: result.raw[index].userStatus,
        };
      });
    });
    return groups;
  }

  public async getGroupById(groupId: string): Promise<Group> {
    logger.debug({ msg: "Getting group by id", metadata: { groupId } });
    const group = await this.findOne({
      where: { id: groupId },
      relations: ["type"],
    });
    if (!group) {
      throw new ResourceNotFoundError("Group not found");
    }
    return group;
  }
}
