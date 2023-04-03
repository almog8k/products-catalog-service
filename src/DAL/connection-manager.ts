import { DataSource, DataSourceOptions } from "typeorm";
import * as configurationProvider from "../common/configuration/configuration-provider";
import { DBConnectionError } from "../common/errors/error-types";
import { logger } from "../common/logger/logger-wrapper";
import { ProductEntity } from "./entity/product-entity";

let dataSource: DataSource;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource !== undefined) {
    return dataSource;
  }
  const dbConfig: DataSourceOptions = configurationProvider.getValue("DB");
  try {
    dataSource = new DataSource({
      ...dbConfig,
      entities: [ProductEntity],
      synchronize: true,
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
