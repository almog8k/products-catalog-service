import { container } from "tsyringe";
import { UserRepository } from "../../DAL/repositories/userRepository";
import { UserEntity } from "../../DAL/entity/userEntity";
import { SimpleUser } from "../schemas/user.schema";
import { logger } from "../../common/logger/logger-wrapper";

export const getAllAuthenticatedUsers = async (): Promise<SimpleUser[]> => {
  const userRepo = container.resolve(UserRepository);

  const users = await userRepo.getAllAuthenticatedUsers();
  logger.debug({ msg: "Users found.", metadata: { users } });
  return users;
};
