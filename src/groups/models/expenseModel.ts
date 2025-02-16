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
