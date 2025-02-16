import { logger } from "../../common/logger/logger-wrapper";
import * as subCategoryRepository from "../../DAL/repositories/subCategoryRepository";
import * as categoryRepository from "../../DAL/repositories/categoryRepository";

export const getSubCategories = async (withCategories: boolean) => {
  logger.info({ msg: "Getting all categories." });
  const repo = await subCategoryRepository.getRepository();
  const subCategories = await repo.getSubCategories(withCategories);
  return subCategories;
};

export const getCategories = async (withSubCategories: boolean) => {
  logger.info({ msg: "Getting all categories." });
  const repo = await categoryRepository.getRepository();
  const categories = await repo.getCategories(withSubCategories);
  return categories;
};
