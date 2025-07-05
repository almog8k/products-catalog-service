import { Repository, DataSource, EntityManager } from "typeorm";
import { GroupExpenseParticipantEntity } from "../entity/groupExpenseParticipantEntity";
import { logger } from "../../common/logger/logger-wrapper";
import { logContext } from "../../common/logger/logContext";
import { uuid } from "uuidv4";

export class GroupExpenseParticipantRepository extends Repository<GroupExpenseParticipantEntity> {
  private readonly logContext: logContext;

  constructor(private dataSource: DataSource) {
    super(GroupExpenseParticipantEntity, dataSource.createEntityManager());
    this.logContext = {
      fileName: __filename,
      className: GroupExpenseParticipantRepository.name,
    };
  }

  /**
   * Bulk insert group expense participants with optional transaction manager
   */
  public async bulkInsertParticipants(
    participants: Partial<GroupExpenseParticipantEntity>[],
    transactionManager?: EntityManager
  ): Promise<GroupExpenseParticipantEntity[]> {
    const logCtx: logContext = {
      ...this.logContext,
      functionName: this.bulkInsertParticipants.name,
    };

    try {
      logger.debug({
        msg: "Bulk inserting group expense participants",
        metadata: { count: participants.length },
      });

      const manager = transactionManager || this.manager;

      // Prepare data with generated IDs
      const preparedData = participants.map((participant) => ({
        id: participant.id || uuid(),
        group_id: participant.groupId,
        expense_split_id: participant.expenseSplitId,
        created_at: participant.createdAt || new Date(),
        updated_at: participant.updatedAt || new Date(),
      }));

      if (preparedData.length === 0) {
        return [];
      }

      // Build parameterized query
      const columns = [
        "id",
        "group_id",
        "expense_split_id",
        "created_at",
        "updated_at",
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
          data.group_id,
          data.expense_split_id,
          data.created_at,
          data.updated_at
        );
      });

      const query = `
        INSERT INTO group_expense_participants (${columns.join(", ")})
        VALUES ${valueStrings.join(", ")}
        RETURNING *
      `;

      const rawResults = await manager.query(query, values);

      logger.debug({
        msg: "Group expense participants inserted",
        logContext: logCtx,
        metadata: { count: rawResults.length },
      });

      // Map raw results directly to entities to avoid SELECT issues
      return rawResults.map((row: any) => {
        const entity = new GroupExpenseParticipantEntity();
        entity.id = row.id;
        entity.groupId = row.group_id;
        entity.expenseSplitId = row.expense_split_id;
        entity.createdAt = row.created_at;
        entity.updatedAt = row.updated_at;
        return entity;
      });
    } catch (err) {
      logger.error({
        msg: "Failed to bulk insert group expense participants",
        logContext: logCtx,
        metadata: { error: err },
      });
      throw err;
    }
  }
}
