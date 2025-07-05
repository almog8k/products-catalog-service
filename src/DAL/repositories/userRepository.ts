import { inject, injectable, InjectionToken } from "tsyringe";
import { SERVICES } from "../../common/constants";
import { DataSource, In, Not, Repository } from "typeorm";
import { UserEntity } from "../entity/userEntity";
import { SimpleUser } from "../../users/schemas/user.schema";
import { logger } from "../../common/logger/logger-wrapper";

@injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  public async getAllAuthenticatedUsers(meId: string): Promise<SimpleUser[]> {
    logger.info({
      msg: `Getting all authenticated users from DB`,
      metadata: { meId },
    });

    const users = await this.find({
      where: { role: "authenticated", id: Not(meId) },
      select: ["id", "email", "rawUserMetaData"],
    });
    const simpleUsers: SimpleUser[] = [];

    users.forEach((user) => {
      simpleUsers.push({
        id: user.id,
        email: user.email,
        fullName: user.rawUserMetaData.full_name,
      });
    });

    logger.info({
      msg: `All authenticated users found in db`,
      metadata: { users },
    });
    return simpleUsers;
  }
  public async getUsersByIds(userIds: string[]): Promise<SimpleUser[]> {
    logger.info({
      msg: `Getting users by IDs from DB`,
      metadata: { userIds },
    });

    const users = await this.find({
      where: { id: In(userIds), role: "authenticated" },
      select: ["id", "email", "rawUserMetaData"],
    });
    const simpleUsers: SimpleUser[] = [];

    users.forEach((user) => {
      simpleUsers.push({
        id: user.id,
        email: user.email,
        fullName: user.rawUserMetaData.full_name,
      });
    });

    logger.info({
      msg: `Users found by IDs in db`,
      metadata: { users },
    });
    return simpleUsers;
  }
}
