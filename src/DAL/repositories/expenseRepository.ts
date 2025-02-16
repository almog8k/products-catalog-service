import * as dataManager from "../connectionManager";
import { logger } from "../../common/logger/logger-wrapper";
import { DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { ResourceNotFoundError } from "../../common/errors/error-types";
import { ExpenseEntity } from "../entity/expenseEntity";
import {
  Expense,
  GroupedExpenseDto,
  NewExpense,
  UpdateExpense,
} from "../../expenses/schemas/expenseSchema";
import { logContext } from "../../common/logger/logContext";
import { ConversionRatesUSDEntity } from "../entity/ConversionRatesByUSDEntity";
import { convertKeysToCamelCase } from "../../common/utils/nameStrategyUtils";
import { UUID } from "../../common/utils/sharedTypes";
import { getMonthAndYearAsDate } from "../../common/utils/time/timeZone";

export class ExpenseRepository extends Repository<ExpenseEntity> {
  private readonly logContext: logContext;
  constructor(private dataSource: DataSource) {
    super(ExpenseEntity, dataSource.createEntityManager());
    this.logContext = {
      fileName: __filename,
      className: ExpenseRepository.name,
    };
  }

  public async insertExpense(newExpense: NewExpense): Promise<ExpenseEntity> {
    logger.debug({ msg: "expense model", metadata: { newExpense } });
    const logCtx: logContext = {
      ...this.logContext,
      functionName: this.insertExpense.name,
    };
    try {
      logger.debug({ msg: "Inserting new expense", metadata: { newExpense } });
      const result = await this.createQueryBuilder()
        .insert()
        .values(newExpense)
        .returning("*")
        .execute();
      logger.debug({
        msg: "Expense inserted",
        logContext: logCtx,
        metadata: { result },
      });
      const r = result.raw[0];
      return result.raw[0];
    } catch (err) {
      logger.error({
        msg: "Failed to insert expense",
        logContext: logCtx,
        metadata: { error: err },
      });
      throw err;
    }
  }

  public async getExpenses(userId: string): Promise<ExpenseEntity[]> {
    logger.debug({ msg: "Getting all expenses" });
    const expenses = await this.find({
      order: { createdAt: "DESC" },
      where: { userId: userId },
    });
    return expenses;
  }

  public async getExpense(id: string): Promise<ExpenseEntity> {
    const logCtx: logContext = {
      ...this.logContext,
      functionName: this.getExpense.name,
    };
    logger.debug({ msg: "Getting expense by id", metadata: { id } });
    const expense = await this.findOne({ where: { id } });
    if (!expense) {
      logger.error({
        msg: "Expense not found",
        logContext: logCtx,
        metadata: { id },
      });
      throw new ResourceNotFoundError(`Expense ${id} was not found`);
    }
    return expense;
  }

  public async updateExpense(
    id: string,
    expenseToUpdate: UpdateExpense
  ): Promise<ExpenseEntity> {
    const logCtx: logContext = {
      ...this.logContext,
      functionName: this.updateExpense.name,
    };
    logger.debug({
      msg: "Updating expense by id",
      metadata: { id, expenseToUpdate },
    });

    await this.getExpense(id); // check if expense exists

    const result = await this.update(id, expenseToUpdate);

    if (result.affected === 0) {
      throw new Error(`Failed to update expense ${id}`); //TODO: create custom error
    }
    const updatedExpense = await this.getExpense(id);

    logger.debug({
      msg: "Expense updated",
      logContext: logCtx,
      metadata: { result },
    });
    return updatedExpense;
  }

  public async deleteExpense(id: string): Promise<void> {
    const logCtx: logContext = {
      ...this.logContext,
      functionName: this.deleteExpense.name,
    };
    await this.getExpense(id); // check if expense exists

    logger.debug({
      msg: "Deleting expense by id",
      logContext: logCtx,
      metadata: { id },
    });
    await this.delete(id);
    logger.debug({
      msg: "Expense deleted",
      logContext: logCtx,
      metadata: { id },
    });
  }

  private async expenseExists(expenseId: string): Promise<boolean> {
    const recordCount = await this.count({ where: { id: expenseId } });
    return recordCount === 1;
  }

  public async getTotalPriceConvertedToTargetRateByMonth(
    userId: string,
    targetRate: number,
    year?: number,
    month?: number,
    timeZone?: string
  ): Promise<number> {
    try {
      const queryBuilder = this.createQueryBuilder("expense")
        .leftJoin(
          ConversionRatesUSDEntity,
          "conversion_rates_usd",
          "expense.currency = conversion_rates_usd.currency"
        )
        .andWhere("expense.user_id = :userId", { userId });

      if (year) {
        queryBuilder.andWhere(
          `EXTRACT(YEAR FROM (expense.created_at AT TIME ZONE :timeZone)) = :year`,
          { year, timeZone }
        );
      }

      if (month) {
        queryBuilder.andWhere(
          `EXTRACT(MONTH FROM (expense.created_at AT TIME ZONE :timeZone)) = :month`,
          { month, timeZone }
        );
      }

      const sql = queryBuilder.getSql();
      const parameters = queryBuilder.getParameters();

      logger.debug({
        msg: "Generated SQL query",
        metadata: { sql, parameters },
      });

      const result = await queryBuilder
        .select(
          "SUM(expense.price / conversion_rates_usd.rate * :targetRate)",
          "total"
        )
        .setParameter("targetRate", targetRate)
        .getRawOne<{ total: number }>();

      if (!result) {
        throw new Error("Failed to get total price converted to target rate");
      }

      return result.total;
    } catch (err) {
      logger.error({
        msg: "Failed to get total price converted to target rate",
        metadata: { error: err },
      });
      throw err;
    }
  }
}

export const getRepository = async (): Promise<ExpenseRepository> => {
  const dataSource = await dataManager.getDataSource();
  return new ExpenseRepository(dataSource);
};
