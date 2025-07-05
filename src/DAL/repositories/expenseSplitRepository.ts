import { Repository, DataSource, EntityManager, In } from "typeorm";
import {
  ExpenseSplitEntity,
  SettlementStatus,
} from "../entity/expenseSplitEntity";
import { logger } from "../../common/logger/logger-wrapper";
import { logContext } from "../../common/logger/logContext";
import { CalculatedGroupExpenseSplit } from "../../expenses/schemas/groupExpenseSchema";
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

      const manager = transactionManager || this.manager;

      // Prepare data with generated IDs
      const preparedData = expenseSplits.map((split) => ({
        id: uuid(),
        expense_id: split.expenseId,
        user_id: split.userId,
        amount: split.amount,
        percentage: split.percentage,
        split_type: split.splitType,
        created_at: new Date(),
        updated_at: new Date(),
        settled_amount: 0,
        settlement_status: SettlementStatus.UNSETTLED,
      }));

      if (preparedData.length === 0) {
        return [];
      }

      // Build parameterized query
      const columns = [
        "id",
        "expense_id",
        "user_id",
        "amount",
        "percentage",
        "split_type",
        "created_at",
        "updated_at",
        "settled_amount",
        "settlement_status",
      ];

      const values: any[] = [];
      const valueStrings: string[] = [];

      preparedData.forEach((data, index) => {
        const valueRefs = columns.map(
          (_, colIndex) => `$${index * columns.length + colIndex + 1}`
        );
        valueStrings.push(`(${valueRefs.join(", ")})`);

        values.push(
          data.id,
          data.expense_id,
          data.user_id,
          data.amount,
          data.percentage,
          data.split_type,
          data.created_at,
          data.updated_at,
          data.settled_amount,
          data.settlement_status
        );
      });

      const query = `
        INSERT INTO expense_splits (${columns.join(", ")})
        VALUES ${valueStrings.join(", ")}
        RETURNING *
      `;

      const rawResults = await manager.query(query, values);

      logger.debug({
        msg: "Expense splits inserted",
        logContext: logCtx,
        metadata: { count: rawResults.length },
      });

      // Convert raw results to entities
      const repository = manager.getRepository(ExpenseSplitEntity);
      const ids = rawResults.map((row: any) => row.id);

      // Map raw results directly to entities to avoid the SELECT issue
      return rawResults.map((row: any) => {
        const entity = new ExpenseSplitEntity();
        entity.id = row.id;
        entity.expenseId = row.expense_id;
        entity.userId = row.user_id;
        entity.amount = parseFloat(row.amount);
        entity.percentage = row.percentage;
        entity.splitType = row.split_type;
        entity.createdAt = row.created_at;
        entity.updatedAt = row.updated_at;
        entity.settledAmount = parseFloat(row.settled_amount);
        entity.settlementStatus = row.settlement_status;
        return entity;
      });
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
