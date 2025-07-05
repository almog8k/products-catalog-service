import { container } from "tsyringe";
import { UserRepository } from "../../DAL/repositories/userRepository";
import { UserEntity } from "../../DAL/entity/userEntity";
import { SimpleUser } from "../schemas/user.schema";
import { logger } from "../../common/logger/logger-wrapper";

export const getAllAuthenticatedUsers = async (
  meId: string
): Promise<SimpleUser[]> => {
  const userRepo = container.resolve(UserRepository);

  const users = await userRepo.getAllAuthenticatedUsers(meId);
  logger.debug({ msg: "Users found.", metadata: { users } });
  return users;
};

export const getUsersByIds = async (
  userIds: string[]
): Promise<SimpleUser[]> => {
  const userRepo = container.resolve(UserRepository);

  const users = await userRepo.getUsersByIds(userIds);
  logger.debug({ msg: "Users found by IDs.", metadata: { users } });
  return users;
};
