import { container } from "tsyringe";
import { getDataSource } from "../DAL/connectionManager";
import { UserGroupsRepository } from "../DAL/repositories/userGroupsRepository";
import { GroupRepository } from "../DAL/repositories/groupRepository";
import { GroupCategoryRepository } from "../DAL/repositories/groupTypesRepository";
import { SERVICES } from "./constants";
import * as configurationProvider from "../common/configuration/configuration-provider";
import { UserRepository } from "../DAL/repositories/userRepository";
import { logger } from "../common/logger/logger-wrapper";
import { createClient } from "@supabase/supabase-js";
import { ConfigSchema } from "./configuration/configuration-schema";
import { SupabaseConfig } from "./configuration/types";
import { ExpenseRepository } from "../DAL/repositories/expenseRepository";
import { ExpenseSplitRepository } from "../DAL/repositories/expenseSplitRepository";
import { GroupExpenseParticipantRepository } from "../DAL/repositories/groupExpenseParticipant";

const DATA_SOURCE_TOKEN = "DATA_SOURCE_TOKEN";

export async function registerContainerDependencies() {
  //supabase

  const supabaseConfig =
    configurationProvider.getValue<SupabaseConfig>("supabase");
  const { url, key } = supabaseConfig;
  const supabase = createClient(url, key);

  container.register(SERVICES.SUPABASE, {
    useValue: supabase,
  });

  container.register(SERVICES.SUPABASECONFIG, { useValue: supabaseConfig });

  // Get DataSource
  const dataSource = await getDataSource();

  container.register(SERVICES.LOGGER, {
    useValue: logger,
  });

  // Register DataSource
  container.register(SERVICES.DATA_SOURCE, {
    useValue: dataSource,
  });

  // Register DataSource
  container.register(DATA_SOURCE_TOKEN, {
    useValue: dataSource,
  });

  // Register Expense Repository

  container.register(ExpenseRepository, {
    useValue: new ExpenseRepository(dataSource),
  });

  // Register UserGroupsRepository
  container.register(UserGroupsRepository, {
    useValue: new UserGroupsRepository(dataSource),
  });

  // Register GroupRepository
  container.register(GroupRepository, {
    useValue: new GroupRepository(
      dataSource,
      container.resolve(UserGroupsRepository)
    ),
  });

  // Register UserRepository
  container.register(GroupCategoryRepository, {
    useValue: new GroupCategoryRepository(dataSource),
  });

  // Register UserRepository
  container.register(UserRepository, {
    useValue: new UserRepository(dataSource),
  });

  // Register ExpenseSplitRepository
  container.register(ExpenseSplitRepository, {
    useValue: new ExpenseSplitRepository(dataSource),
  });

  // Register GroupExpenseParticipantRepository
  container.register(GroupExpenseParticipantRepository, {
    useValue: new GroupExpenseParticipantRepository(dataSource),
  });
}
