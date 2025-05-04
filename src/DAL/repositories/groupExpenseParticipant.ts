import { Repository, DataSource, EntityManager } from "typeorm";
import { GroupExpenseParticipantEntity } from "../entity/groupExpenseParticipantEntity";
import { logger } from "../../common/logger/logger-wrapper";
import { logContext } from "../../common/logger/logContext";

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

      // Use provided transaction manager or create a new query builder
      const queryBuilder = transactionManager
        ? transactionManager.createQueryBuilder(
            GroupExpenseParticipantEntity,
            "participant"
          )
        : this.createQueryBuilder();

      const result = await queryBuilder
        .insert()
        .values(participants)
        .returning("*")
        .execute();

      logger.debug({
        msg: "Group expense participants inserted",
        logContext: logCtx,
        metadata: { count: result.raw.length },
      });

      return result.raw;
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
