import { DataSource, DataSourceOptions } from "typeorm";
import * as configurationProvider from "../common/configuration/configuration-provider";
import { DBConnectionError } from "../common/errors/error-types";
import { logger } from "../common/logger/logger-wrapper";
import { ProductEntity } from "./entity/product-entity";
import { ExpenseEntity } from "./entity/expenseEntity";
import { SubCategoryEntity } from "./entity/subCategory";
import { CategoryEntity } from "./entity/categoryEntity";
import { ConversionRatesUSDEntity } from "./entity/ConversionRatesByUSDEntity";
import { CustomNamingStrategy } from "./namingStrategy/customeNamingStrategy";

export let dataSource: DataSource;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource !== undefined) {
    return dataSource;
  }
  const dbConfig: DataSourceOptions = configurationProvider.getValue("DB");
  try {
    dataSource = new DataSource({
      ...dbConfig,
      entities: [
        ExpenseEntity,
        CategoryEntity,
        SubCategoryEntity,
        ConversionRatesUSDEntity,
      ],
      synchronize: false,
      // namingStrategy: new CustomNamingStrategy(),
    });

    await dataSource.initialize();
    logger.info({
      msg: "Successfully connected to db",
      metadata: { dbConfig },
    });

    return dataSource;
  } catch (err) {
    logger.error({ msg: err.message, metadata: { err, dbConfig } });
    throw new DBConnectionError("Db failed to connect", false);
  }
}
