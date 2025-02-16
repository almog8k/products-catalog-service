import { DataSource, DataSourceOptions } from "typeorm";
import { ExpenseEntity } from "./entity/expenseEntity";
import { CategoryEntity } from "./entity/categoryEntity";
import { SubCategoryEntity } from "./entity/subCategory";
import { ConversionRatesUSDEntity } from "./entity/ConversionRatesByUSDEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "127.0.0.1",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "expense_manager",
  entities: [
    ExpenseEntity,
    CategoryEntity,
    SubCategoryEntity,
    ConversionRatesUSDEntity,
  ],
  migrations: ["src/DAL/migrations/*.ts"],
  synchronize: false,
});
