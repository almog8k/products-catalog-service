import { RequestHandler } from "express";

import { logger } from "../../common/logger/logger-wrapper";

import * as util from "../../common/utils/util";
import * as groupModel from "../models/groupModel";

import httpStatus from "http-status-codes";

import { headersSchema, uuidSchema } from "../schemas/commonSchema";
import { GroupTypeEntity } from "../../DAL/entity/groupTypeEntity";
import {
  Group,
  NewGroup,
  newGroupSchema,
  UpdateUserGroupStatusReq,
  updateUserGroupStatusReqSchema,
  UpdateUserGroupStatusRes,
} from "../schemas/groupSchema";

type GetGroupCategoriesHandler = RequestHandler<void, GroupTypeEntity[]>;

type CreateGroupHandler = RequestHandler<void, Group, NewGroup>;

type GetGroupsByUserIdHandler = RequestHandler<void, Group[]>;

type UpdateUserGroupStatusHandler = RequestHandler<
  { groupId: string },
  UpdateUserGroupStatusRes,
  UpdateUserGroupStatusReq
>;

export const getGroupTypes: GetGroupCategoriesHandler = async (
  req,
  res,
  next
) => {
  logger.info({
    msg: `getting all group types`,
  });
  try {
    // const userId = req.headers["user-id"];

    // const validUserId = util.typeValidator(userId, uuidSchema);

    const groupCategories = await groupModel.getGroupTypes();
    return res.status(httpStatus.OK).json(groupCategories);
  } catch (error) {
    return next(error);
  }
};

export const createGroup: CreateGroupHandler = async (req, res, next) => {
  logger.info({
    msg: `creating new group`,
    metadata: { reqBody: req.body },
  });
  try {
    const userId = req.headers["user-id"];

    const validUserId = util.typeValidator(userId, uuidSchema);
    const newGroup: NewGroup = util.typeValidator(req.body, newGroupSchema);
    const group = await groupModel.createGroup(newGroup, validUserId);
    return res.status(httpStatus.CREATED).json(group);
  } catch (error) {
    return next(error);
  }
};

export const getGroupsByUserId: GetGroupsByUserIdHandler = async (
  req,
  res,
  next
) => {
  logger.info({
    msg: `getting groups by user id`,
  });
  try {
    const userId = req.headers["user-id"];

    const validUserId = util.typeValidator(userId, uuidSchema);
    const groups = await groupModel.getGroupsByUserId(validUserId);
    return res.status(httpStatus.OK).json(groups);
  } catch (error) {
    return next(error);
  }
};

export const updateUserGroupStatus: UpdateUserGroupStatusHandler = async (
  req,
  res,
  next
) => {
  logger.info({
    msg: `updating user group status`,
    metadata: { reqBody: req.body },
  });
  try {
    const userId = req.headers["user-id"];
    const groupId = req.params.groupId;
    const reqBody = req.body;

    const validUserId = util.typeValidator(userId, uuidSchema);
    const validGroupId = util.typeValidator(groupId, uuidSchema);
    const { status } = util.typeValidator(
      reqBody,
      updateUserGroupStatusReqSchema
    );

    const updateUserGroupStatusRes = await groupModel.updateUserGroupStatus(
      validUserId,
      validGroupId,
      status
    );
    return res.status(httpStatus.OK).json(updateUserGroupStatusRes);
  } catch (error) {
    return next(error);
  }
};
