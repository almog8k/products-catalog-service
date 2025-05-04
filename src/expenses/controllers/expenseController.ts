import { RequestHandler } from "express";

import { logger } from "../../common/logger/logger-wrapper";

import * as util from "../../common/utils/util";
import * as expenseModel from "../models/expenseModel";
import * as exchangeRateModel from "../models/currencyConversionRateModel";

import httpStatus from "http-status-codes";
import {
  Expense,
  GroupedExpenseDto,
  NewExpense,
  newExpenseSchema,
  TotalSum,
  UpdateExpense,
  UpdateExpenseSchema,
} from "../schemas/expenseSchema";
import { UUID, UUIDSchema } from "../../common/utils/sharedTypes";
import {
  GetExpensesTotalRequestQuery,
  getExpensesTotalRequestQuerySchema,
} from "../schemas/exchangeRateSchema";
import { timeZoneHeaderSchema } from "../schemas/commonSchema";
import {
  GroupExpense,
  NewGroupExpense,
  newGroupExpenseSchema,
} from "../schemas/groupExpenseSchema";

type CreateExpenseHandler = RequestHandler<void, Expense, NewExpense>;
type GetExpensesHandler = RequestHandler<void, Expense[]>;
type GetExpenseHandler = RequestHandler<UUID, Expense>;
type UpdateExpenseHandler = RequestHandler<UUID, Expense, UpdateExpense>;
type DeleteExpenseHandler = RequestHandler<UUID, void>;
type GetTotalExpensesHandler = RequestHandler<
  void,
  TotalSum,
  void,
  GetExpensesTotalRequestQuery
>;
type updateExchangeRateHandler = RequestHandler<void, number, void>;
type GetExpensesGroupByMonthYearHandler = RequestHandler<
  void,
  GroupedExpenseDto[],
  void
>;

type CreateGroupExpenseHandler = RequestHandler<
  void,
  GroupExpense,
  NewGroupExpense
>;

export const createExpense: CreateExpenseHandler = async (req, res, next) => {
  logger.info({
    msg: `creating new Expense`,
    metadata: { reqBody: req.body },
  });
  try {
    const expenseToValidate = { ...req.body, userId: req.user.id };
    const newExpense: NewExpense = util.typeValidator(
      expenseToValidate,
      newExpenseSchema
    );
    const expense = await expenseModel.createExpense(newExpense);
    return res.status(httpStatus.CREATED).json(expense);
  } catch (error) {
    return next(error);
  }
};

export const createGroupExpense: CreateGroupExpenseHandler = async (
  req,
  res,
  next
) => {
  logger.info({
    msg: `creating new group expense`,
    metadata: { reqBody: req.body },
  });
  try {
    req.body.expense.userId = req.user.id;
    const newGroupExpense: NewGroupExpense = util.typeValidator(
      req.body,
      newGroupExpenseSchema
    );
    const groupExpense = await expenseModel.createGroupExpense(newGroupExpense);
    return res.status(httpStatus.CREATED).json(groupExpense);
  } catch (error) {
    return next(error);
  }
};

export const getExpenses: GetExpensesHandler = async (req, res, next) => {
  logger.info({
    msg: `getting all expenses`,
  });
  try {
    const expenses = await expenseModel.getExpenses(req.user.id);
    return res.status(httpStatus.OK).json(expenses);
  } catch (error) {
    return next(error);
  }
};

export const getExpense: GetExpenseHandler = async (req, res, next) => {
  logger.info({
    msg: `getting expense by id`,
    metadata: { id: req.params.id },
  });
  try {
    const validParams: UUID = util.typeValidator(req.params, UUIDSchema);
    const expense = await expenseModel.getExpense(validParams.id);
    return res.status(httpStatus.OK).json(expense);
  } catch (error) {
    return next(error);
  }
};

export const updateExpense: UpdateExpenseHandler = async (req, res, next) => {
  logger.info({
    msg: `updating expense by id`,
    metadata: { id: req.params.id },
  });
  try {
    const validParams: UUID = util.typeValidator(req.params, UUIDSchema);
    const validUpdateExpense: UpdateExpense = util.typeValidator(
      req.body,
      UpdateExpenseSchema
    );
    const updatedExpense = await expenseModel.updateExpense(
      validParams.id,
      validUpdateExpense
    );
    return res.status(httpStatus.OK).json(updatedExpense);
  } catch (error) {
    return next(error);
  }
};

export const deleteExpense: DeleteExpenseHandler = async (req, res, next) => {
  logger.info({
    msg: `deleting expense by id`,
    metadata: { id: req.params.id },
  });
  try {
    const validParams: UUID = util.typeValidator(req.params, UUIDSchema);
    await expenseModel.deleteExpense(validParams.id);
    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};

export const getExpensesTotal: GetTotalExpensesHandler = async (
  req,
  res,
  next
) => {
  logger.info({
    msg: `getting expenses total`,
  });
  try {
    const userId = req.user.id;
    const { targetCurrency } = util.typeValidator(
      req.query,
      getExpensesTotalRequestQuerySchema
    );

    logger.debug({
      msg: "validParams",
      metadata: { validParams: { targetCurrency, userId } },
    });
    const totalExpenses = await expenseModel.getTotalExpensesInCurrency(
      userId,
      targetCurrency.toUpperCase()
    );

    // const totalExpenses:string = await expenseModel.getTotalExpenses();
    return res.status(httpStatus.OK).json(totalExpenses);
  } catch (error) {
    return next(error);
  }
};

export const updateExchangeRate: updateExchangeRateHandler = async (
  req,
  res,
  next
) => {
  logger.info({
    msg: `updating exchange rate`,
  });
  try {
    const affected = await exchangeRateModel.updateExchangeRatesIfNeeded();
    return res.status(httpStatus.OK).json(affected);
  } catch (error) {
    return next(error);
  }
};

export const getExpensesGroupByMonthYear: GetExpensesGroupByMonthYearHandler =
  async (req, res, next) => {
    logger.info({
      msg: `getting expenses grouped by month and year`,
    });
    try {
      const userId = req.user.id;
      const validHeaders = util.typeValidator(
        req.headers,
        timeZoneHeaderSchema
      );

      const expenses = await expenseModel.getExpensesGroupByMonthYear(
        userId,
        validHeaders["time-zone"] ?? "utc"
      );
      return res.status(httpStatus.OK).json(expenses);
    } catch (error) {
      return next(error);
    }
  };
