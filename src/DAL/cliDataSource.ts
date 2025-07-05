import { DataSource, DataSourceOptions } from "typeorm";
import { ExpenseEntity } from "./entity/expenseEntity";
import { CategoryEntity } from "./entity/categoryEntity";
import { SubCategoryEntity } from "./entity/subCategory";
import { ConversionRatesUSDEntity } from "./entity/ConversionRatesByUSDEntity";
import { GroupTypeEntity } from "./entity/groupTypeEntity";
import { GroupEntity } from "./entity/groupEntity";
import { UserGroupsEntity } from "./entity/userGroupsEntity";
import { ExpenseSplitEntity } from "./entity/expenseSplitEntity";
import { GroupExpenseParticipantEntity } from "./entity/groupExpenseParticipantEntity";
import { PaymentSettlementEntity } from "./entity/paymentSettlementEntity";
import { PaymentSplitSettlementEntity } from "./entity/paymentSplitSettlementEntity";
import { UserEntity } from "./entity/userEntity";
import { ApartmentEntity } from "./entity/investments/apartments/apartmentEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "aws-0-eu-central-1.pooler.supabase.com",
  port: 6543,
  username: "postgres.rshfxkwssnjrdqyvapdi",
  password: "Ak208753996!",
  database: "postgres",
  schema: "public",
  entities: [
    ExpenseEntity,
    CategoryEntity,
    SubCategoryEntity,
    ConversionRatesUSDEntity,
    GroupTypeEntity,
    UserEntity,
    GroupEntity,
    UserGroupsEntity,
    ExpenseSplitEntity,
    GroupExpenseParticipantEntity,
    PaymentSettlementEntity,
    PaymentSplitSettlementEntity,
    ApartmentEntity,
  ],
  migrations: ["src/DAL/migrations/*.ts"],
  subscribers: ["src/DAL/subscriber/*.ts"],

  synchronize: false,
});
