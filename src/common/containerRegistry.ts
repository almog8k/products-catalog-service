import { container } from "tsyringe";
import { getDataSource } from "../DAL/connectionManager";
import { UserGroupsRepository } from "../DAL/repositories/userGroupsRepository";
import { GroupRepository } from "../DAL/repositories/groupRepository";
import { GroupCategoryRepository } from "../DAL/repositories/groupTypesRepository";
import { SERVICES } from "./constants";
import { UserRepository } from "../DAL/repositories/userRepository";
import { logger } from "../common/logger/logger-wrapper";

const DATA_SOURCE_TOKEN = "DATA_SOURCE_TOKEN";

export async function registerContainerDependencies() {
  // Get DataSource
  const dataSource = await getDataSource();

  container.register(SERVICES.LOGGER, {
    useValue: logger,
  });

  container.register(SERVICES.DATA_SOURCE, {
    useValue: dataSource,
  });

  // Register DataSource
  container.register(DATA_SOURCE_TOKEN, {
    useValue: dataSource,
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

  container.register(GroupCategoryRepository, {
    useValue: new GroupCategoryRepository(dataSource),
  });

  container.register(UserRepository, {
    useValue: new UserRepository(dataSource),
  });
}
