import { Repository, DataSource, EntityManager } from "typeorm";
import {
  ExpenseSplitEntity,
  SettlementStatus,
} from "../entity/expenseSplitEntity";
import { logger } from "../../common/logger/logger-wrapper";
import { logContext } from "../../common/logger/logContext";
import { CalculatedGroupExpenseSplit } from "../../expenses/schemas/groupExpenseSchema";
import e from "express";
import { uuid } from "uuidv4";

export class ExpenseSplitRepository extends Repository<ExpenseSplitEntity> {
  private readonly logContext: logContext;

  constructor(private dataSource: DataSource) {
    super(ExpenseSplitEntity, dataSource.createEntityManager());
    this.logContext = {
      fileName: __filename,
      className: ExpenseSplitRepository.name,
    };
  }

  /**
   * Insert expense split with optional transaction manager
   */
  public async insertExpenseSplit(
    expenseSplit: Partial<ExpenseSplitEntity>,
    transactionManager?: EntityManager
  ): Promise<ExpenseSplitEntity> {
    const logCtx: logContext = {
      ...this.logContext,
      functionName: this.insertExpenseSplit.name,
    };

    try {
      logger.debug({
        msg: "Inserting new expense split",
        metadata: { expenseSplit },
      });

      // Use provided transaction manager or create a new query builder
      const queryBuilder = transactionManager
        ? transactionManager.createQueryBuilder(
            ExpenseSplitEntity,
            "expenseSplit"
          )
        : this.createQueryBuilder();

      const result = await queryBuilder
        .insert()
        .values(expenseSplit)
        .returning("*")
        .execute();

      logger.debug({
        msg: "Expense split inserted",
        logContext: logCtx,
        metadata: { result },
      });

      return result.raw[0];
    } catch (err) {
      logger.error({
        msg: "Failed to insert expense split",
        logContext: logCtx,
        metadata: { error: err },
      });
      throw err;
    }
  }

  /**
   * Bulk insert expense splits with optional transaction manager
   */
  public async bulkInsertExpenseSplits(
    expenseSplits: CalculatedGroupExpenseSplit[],
    transactionManager?: EntityManager
  ): Promise<ExpenseSplitEntity[]> {
    const logCtx: logContext = {
      ...this.logContext,
      functionName: this.bulkInsertExpenseSplits.name,
    };

    try {
      logger.debug({
        msg: "Bulk inserting expense splits",
        metadata: { count: expenseSplits.length },
      });

      // Use provided transaction manager or create a new query builder
      const queryBuilder = transactionManager
        ? transactionManager.createQueryBuilder(
            ExpenseSplitEntity,
            "expenseSplit"
          )
        : this.createQueryBuilder();

      const entities = expenseSplits.map((split) => {
        const entity = new ExpenseSplitEntity();
        entity.userId = split.userId;
        entity.expenseId = split.expenseId;
        entity.amount = split.amount;
        entity.percentage = split.percentage;
        entity.splitType = split.splitType;
        entity.createdAt = new Date();
        entity.updatedAt = new Date();
        entity.settledAmount = 0;
        entity.settlementStatus = SettlementStatus.UNSETTLED;
        entity.id = uuid();
        return entity;
      });

      const result = await queryBuilder
        .insert()
        .into("expense_splits")
        .values(entities)
        .returning("*")
        .execute();

      logger.debug({
        msg: "Expense splits inserted",
        logContext: logCtx,
        metadata: { count: result.raw.length },
      });

      return result.raw;
    } catch (err) {
      logger.error({
        msg: "Failed to bulk insert expense splits",
        logContext: logCtx,
        metadata: { error: err },
      });
      throw err;
    }
  }
}
