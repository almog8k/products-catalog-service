import { RequestHandler } from "express";
import { SimpleUser } from "../schemas/user.schema";
import * as userModel from "../models/userModel";
import httpStatus from "http-status-codes";
import { logger } from "../../common/logger/logger-wrapper";

type GetAllAuthenticatedUsersHandler = RequestHandler<void, SimpleUser[]>;

export const getAllAuthenticatedUsers: GetAllAuthenticatedUsersHandler = async (
  req,
  res,
  next
) => {
  try {
    logger.info({
      msg: `getting all authenticated users`,
    });
    const users = await userModel.getAllAuthenticatedUsers(req.user.id);
    logger.info({
      msg: `all authenticated users found`,
      metadata: { users },
    });
    return res.status(httpStatus.OK).json(users);
  } catch (error) {
    return next(error);
  }
};
