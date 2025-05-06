import { logger } from "../../common/logger/logger-wrapper";
import * as expenseRepository from "../../DAL/repositories/expenseRepository";
import {
  Expense,
  GroupedExpenseDto,
  NewExpense,
  TotalSum,
  UpdateExpense,
} from "../schemas/expenseSchema";
import * as conversionRateRepository from "../../DAL/repositories/conversionRatesUSDRepository";
import { ConversionRatesUSDEntity } from "../../DAL/entity/ConversionRatesByUSDEntity";
import { ExpenseEntity } from "../../DAL/entity/expenseEntity";
import { getMonthAndYearAsDate } from "../../common/utils/time/timeZone";
import {
  CalculatedGroupExpenseSplit,
  GroupExpense,
  GroupExpenseSplits,
  NewGroupExpense,
} from "../schemas/groupExpenseSchema";
import { container } from "tsyringe";
import { UserGroupsRepository } from "../../DAL/repositories/userGroupsRepository";
import { ResourceNotFoundError } from "../../common/errors/error-types";
import { getManager } from "typeorm";
import { AppDataSource } from "../../DAL/cliDataSource";
import { dataSource } from "../../DAL/connectionManager";
import {
  ExpenseSplitEntity,
  SplitType,
} from "../../DAL/entity/expenseSplitEntity";
import { ExpenseSplitRepository } from "../../DAL/repositories/expenseSplitRepository";
import { GroupExpenseParticipantRepository } from "../../DAL/repositories/groupExpenseParticipant";

export async function createExpense(newExpense: NewExpense): Promise<Expense> {
  logger.info({ msg: "Creating new Expense." });
  const repo = await expenseRepository.getRepository();
  const expense = await repo.insertExpense(newExpense);
  return expense;
}

export async function getExpenses(userId: string): Promise<Expense[]> {
  logger.info({ msg: "Getting all expenses.", metadata: { userId } });
  const repo = await expenseRepository.getRepository();
  const expenses = await repo.getExpenses(userId);
  return expenses;
}

export async function getExpense(id: string): Promise<Expense> {
  logger.info({ msg: "Getting expense by id.", metadata: { id } });
  const repo = await expenseRepository.getRepository();
  const expense = await repo.getExpense(id);
  return expense;
}

export async function updateExpense(
  id: string,
  expenseToUpdate: UpdateExpense
): Promise<Expense> {
  logger.info({ msg: "Updating expense by id.", metadata: { id } });
  const repo = await expenseRepository.getRepository();
  const expense = await repo.updateExpense(id, expenseToUpdate);
  return expense;
}

export async function deleteExpense(id: string): Promise<void> {
  logger.info({ msg: "Deleting expense by id.", metadata: { id } });
  const repo = await expenseRepository.getRepository();
  await repo.deleteExpense(id);
}

export const getTotalExpensesInCurrency = async (
  userId: string,
  targetCurrency: string,
  options?: { month?: number; year?: number; timeZone?: string }
): Promise<TotalSum> => {
  const expenseRepo = await expenseRepository.getRepository();
  const conversionRateRepo = await conversionRateRepository.getRepository();

  // Get the exchange rate for the target currency
  const targetRate = await conversionRateRepo.getExchangeRateByCurrency(
    targetCurrency
  );

  logger.debug({
    msg: "Got exchange rate for target currency",
    metadata: { targetRate },
  });

  // Get the total expenses converted to the target currency
  let total = await expenseRepo.getTotalPriceConvertedToTargetRateByMonth(
    userId,
    targetRate,
    options?.year,
    options?.month,
    options?.timeZone
  );
  logger.info({
    msg: "Got expenses total",
    metadata: { total },
  });
  if (!total) {
    total = 0;
  }

  return { sum: total, currency: targetCurrency };
};

export const getExpensesGroupByMonthYear = async (
  userId: string,
  timeZone: string
): Promise<GroupedExpenseDto[]> => {
  const expenseRepo = await expenseRepository.getRepository();
  const expenses = await expenseRepo.getExpenses(userId);

  const groupedExpensesRaw = getExpensesWithMonthYear(expenses);
  // Process the raw result to the desired structure
  const groupedExpenses: GroupedExpenseDto[] = [];
  const expenseMap = new Map<string, Expense[]>();

  groupedExpensesRaw.forEach((groupedExpense) => {
    const { monthYear, ...expense } = groupedExpense;
    const groupKey = new Date(monthYear).toISOString().split("T")[0];

    if (!expenseMap.get(groupKey)) {
      expenseMap.set(groupKey, []);
    }

    expenseMap.get(groupKey)?.push(expense);
  });

  logger.debug({
    msg: "Expenses Map",
    metadata: { expenseMap: expenseMap.size },
  });

  for (const [monthYear, expenses] of expenseMap) {
    const year = new Date(monthYear).getFullYear();
    const month = new Date(monthYear).getMonth() + 1;
    // Get the total sum of expenses in ILS
    const totalSum = await getTotalExpensesInCurrency(userId, "ILS", {
      year,
      month,
      timeZone,
    });
    groupedExpenses.push({ monthYear, expenses, totalSum });
  }

  // expenseMap.forEach((expenses, monthYear) => {
  //   const year = new Date(monthYear).getFullYear();
  //   const month = new Date(monthYear).getMonth();
  //   const totalSum = await getTotalExpensesInCurrency(userId, 'ILS', {year, month} );
  //   groupedExpenses.push({ monthYear, expenses, totalSum });
  // });

  return groupedExpenses;
};

function getExpensesWithMonthYear(
  expenses: ExpenseEntity[]
): (ExpenseEntity & { monthYear: Date })[] {
  return expenses.map((expense) => {
    return {
      ...expense,
      monthYear: getMonthAndYearAsDate(expense.createdAt),
    };
  });
}

// GroupedExpense

function calculateSplits(
  totalAmount: number,
  expenseId: string,
  requestedSplits: GroupExpenseSplits
): CalculatedGroupExpenseSplit[] {
  const calculatedSplits: CalculatedGroupExpenseSplit[] = [];
  let amount = 0;
  let percentage = 0;

  // Handle each split type
  requestedSplits.forEach((split, index) => {
    let calcSplit: CalculatedGroupExpenseSplit;
    switch (split.splitType) {
      case SplitType.EQUAL:
        // For equal splits, divide the total amount by the number of participants
        amount = parseFloat((totalAmount / requestedSplits.length).toFixed(2));

        percentage = parseFloat(((amount / totalAmount) * 100).toFixed(2));

        calcSplit = { ...split, amount, percentage, expenseId };
        break;

      case SplitType.PERCENTAGE:
        // For percentage splits, calculate amount based on the provided percentage
        amount = parseFloat(
          ((split.percentage / 100) * totalAmount).toFixed(2)
        );
        calcSplit = {
          ...split,
          amount,
          expenseId,
        };
        break;

      case SplitType.CUSTOM:
        // For custom splits, use the provided amount
        percentage = parseFloat(
          ((split.amount / totalAmount) * 100).toFixed(2)
        );
        calcSplit = {
          ...split,
          percentage,
          expenseId,
        };
        break;
    }

    calculatedSplits.push(calcSplit);
  });

  // Validate that splits add up to total amount (within a small margin of error for floating point)
  const totalSplitAmount = calculatedSplits.reduce(
    (sum, split) => (sum + split.amount, 0),
    0
  );
  if (Math.abs(totalSplitAmount - totalAmount) > 0.01) {
    // Handle rounding errors by adjusting the first split
    const difference = totalAmount - totalSplitAmount;
    calculatedSplits[0].amount = parseFloat(
      (calculatedSplits[0].amount + difference).toFixed(2)
    );
  }

  return calculatedSplits;
}

export const createGroupExpense = async (
  groupExpense: NewGroupExpense
): Promise<GroupExpense> => {
  try {
    const { expense, splits } = groupExpense;
    const userGroupRepo = container.resolve(UserGroupsRepository);
    const expenseSplitRepo = container.resolve(ExpenseSplitRepository);
    const groupExpenseParticipantsRepo = container.resolve(
      GroupExpenseParticipantRepository
    );

    if (!(await userGroupRepo.IsUserInGroup(expense.userId, expense.groupId))) {
      throw new ResourceNotFoundError(
        "Group not found or user is not a member"
      );
    }

    return dataSource.transaction(async (transactionManager) => {
      const expenseRepo = container.resolve(
        expenseRepository.ExpenseRepository
      );

      // 1. Insert the expense
      const newExpense = await expenseRepo.insertExpense(
        expense,
        transactionManager
      );

      logger.debug({
        msg: "Expense created",
        metadata: { newExpense },
      });

      // 2. Calculate splits and add them to the expense
      const calculatedSplits = calculateSplits(
        newExpense.price,
        newExpense.id,
        splits
      );

      logger.debug({
        msg: "Calculated splits",
        metadata: { calculatedSplits },
      });

      // 3. Insert the splits
      const savedSplits = await expenseSplitRepo.bulkInsertExpenseSplits(
        calculatedSplits,
        transactionManager
      );

      logger.debug({
        msg: "Expense splits created",
        metadata: { savedSplits },
      });

      const participants = splits.map((split) => ({
        userId: split.userId,
        expenseSplitId: newExpense.id,
      }));

      // 4. Insert the participants into the group_expense_participants table

      const savedParticipants =
        await groupExpenseParticipantsRepo.bulkInsertParticipants(
          participants,
          transactionManager
        );

      logger.debug({
        msg: "Group expense participants created",
        metadata: { savedParticipants },
      });

      const groupExpense: GroupExpense = {
        expense: newExpense,
        splits: savedSplits,
      };

      logger.info({
        msg: "Group expense created",
        metadata: { groupExpense },
      });

      return groupExpense;
    });
  } catch (error) {
    logger.error({
      msg: "Error creating group expense",
      metadata: { error },
    });
    throw error;
  }
};
