import * as dataManager from "../connectionManager";

import { logger } from "../../common/logger/logger-wrapper";
import { DataSource, Repository } from "typeorm";

import { SubCategoryEntity } from "../entity/subCategory";

export class SubCategoryRepository extends Repository<SubCategoryEntity> {
  constructor(private dataSource: DataSource) {
    super(SubCategoryEntity, dataSource.createEntityManager());
  }

  public async getSubCategories(
    withCategories: boolean
  ): Promise<SubCategoryEntity[]> {
    const relations = withCategories ? ["category"] : undefined;
    logger.debug({ msg: "Getting all subCategories" });
    const subCategories = await this.find({
      relations,
    });
    logger.debug({ msg: "SubCategories found", metadata: { subCategories } });
    return subCategories;
  }
}

export const getRepository = async (): Promise<SubCategoryRepository> => {
  const dataSource = await dataManager.getDataSource();
  return new SubCategoryRepository(dataSource);
};
