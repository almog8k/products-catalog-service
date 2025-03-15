import * as dataManager from "../connectionManager";

import { logger } from "../../common/logger/logger-wrapper";
import { DataSource, Repository } from "typeorm";
import { GroupTypeEntity } from "../entity/groupTypeEntity";

export class GroupCategoryRepository extends Repository<GroupTypeEntity> {
  constructor(private dataSource: DataSource) {
    super(GroupTypeEntity, dataSource.createEntityManager());
  }

  public async getGroupTypes(): Promise<GroupTypeEntity[]> {
    logger.debug({ msg: "Getting all group types (Repository)" });
    const categories = await this.find();
    logger.debug({ msg: "Group types found", metadata: { categories } });
    return categories;
  }
}
