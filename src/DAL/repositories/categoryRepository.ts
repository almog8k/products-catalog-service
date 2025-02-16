import * as dataManager from "../connectionManager";

import { logger } from "../../common/logger/logger-wrapper";
import { DataSource, Repository } from "typeorm";

import { SubCategoryEntity } from "../entity/subCategory";
import { CategoryEntity } from "../entity/categoryEntity";

export class CategoryRepository extends Repository<CategoryEntity> {
  constructor(private dataSource: DataSource) {
    super(CategoryEntity, dataSource.createEntityManager());
  }

  public async getCategories(
    withCategories: boolean
  ): Promise<CategoryEntity[]> {
    const relations = withCategories ? ["subCategories"] : undefined;
    logger.debug({ msg: "Getting all categories" });
    const categories = await this.find({ relations });
    logger.debug({ msg: "Categories found", metadata: { categories } });
    return categories;
  }

  public async getCategoriesWithSubSubCategories(): Promise<CategoryEntity[]> {
    logger.debug({ msg: "Getting all categories with subCategories" });
    const categories = await this.find({ relations: ["subCategories"] });
    logger.debug({ msg: "Categories found", metadata: { categories } });
    return categories;
  }
}

export const getRepository = async (): Promise<CategoryRepository> => {
  const dataSource = await dataManager.getDataSource();
  return new CategoryRepository(dataSource);
};
