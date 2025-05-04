// src/entities/GroupExpenseParticipant.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { TimeRecordEntity } from "./timeRecordEntity";
import { GroupEntity } from "./groupEntity";
import { ExpenseSplitEntity } from "./expenseSplitEntity";

@Entity({ name: "group_expense_participants" })
@Unique(["groupId", "expenseSplitId"])
export class GroupExpenseParticipantEntity extends TimeRecordEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => GroupEntity, { onDelete: "CASCADE" })
  group: GroupEntity;

  @Column()
  groupId: string;

  @ManyToOne(() => ExpenseSplitEntity, { onDelete: "CASCADE" })
  expenseSplit: ExpenseSplitEntity;

  @Column()
  expenseSplitId: string;
}
