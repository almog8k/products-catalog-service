import { RequestHandler } from "express";

import { logger } from "../../common/logger/logger-wrapper";

import * as util from "../../common/utils/util";
import * as groupModel from "../models/groupModel";

import httpStatus from "http-status-codes";

import {
  headersSchema,
  userIdBodySchema,
  uuidSchema,
} from "../schemas/commonSchema";
import { GroupTypeEntity } from "../../DAL/entity/groupTypeEntity";
import {
  Group,
  NewGroup,
  newGroupSchema,
  UpdateUserGroupStatusReq,
  updateUserGroupStatusReqSchema,
  UpdateUserGroupStatusRes,
} from "../schemas/groupSchema";
import { GroupIdParam, UserIdBody } from "../types";

type GetGroupCategoriesHandler = RequestHandler<void, GroupTypeEntity[]>;

type CreateGroupHandler = RequestHandler<void, Group, NewGroup>;

type GetGroupsByUserIdHandler = RequestHandler<void, Group[]>;

type GetGroupByIdHandler = RequestHandler<GroupIdParam, Group>;

type InviteUserToGroupHandler = RequestHandler<GroupIdParam, void, UserIdBody>;

type UpdateUserGroupStatusHandler = RequestHandler<
  GroupIdParam,
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
    const userId = req.user.id;

    const newGroup: NewGroup = util.typeValidator(req.body, newGroupSchema);
    const group = await groupModel.createGroup(newGroup, userId);
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
    const userId = req.user.id;

    const groups = await groupModel.getGroupsByUserId(userId);
    return res.status(httpStatus.OK).json(groups);
  } catch (error) {
    return next(error);
  }
};

export const getGroupById: GetGroupByIdHandler = async (req, res, next) => {
  logger.info({
    msg: `getting group by id`,
    metadata: { groupId: req.params.groupId },
  });
  try {
    const groupId = req.params.groupId;

    const validGroupId = util.typeValidator(groupId, uuidSchema);
    const group = await groupModel.getGroupById(validGroupId);
    return res.status(httpStatus.OK).json(group);
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
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const reqBody = req.body;

    const validGroupId = util.typeValidator(groupId, uuidSchema);
    const { status } = util.typeValidator(
      reqBody,
      updateUserGroupStatusReqSchema
    );

    const updateUserGroupStatusRes = await groupModel.updateUserGroupStatus(
      userId,
      validGroupId,
      status
    );
    return res.status(httpStatus.OK).json(updateUserGroupStatusRes);
  } catch (error) {
    return next(error);
  }
};

export const inviteUserToGroup: InviteUserToGroupHandler = async (
  req,
  res,
  next
) => {
  logger.info({
    msg: `Inviting user to group`,
    metadata: { groupId: req.params.groupId },
  });
  try {
    const groupId = req.params.groupId;

    const validUserId = util.typeValidator(req.body, userIdBodySchema).userId;
    const validGroupId = util.typeValidator(groupId, uuidSchema);

    await groupModel.addUserToGroup(validUserId, validGroupId);
    return res.status(httpStatus.OK).json();
  } catch (error) {
    return next(error);
  }
};
