// src/entities/ExpenseSplit.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ExpenseEntity } from "./expenseEntity";
import { UserEntity } from "./userEntity";
import { TimeRecordEntity } from "./timeRecordEntity";
import { PaymentSplitSettlementEntity } from "./paymentSplitSettlementEntity";

export enum SplitType {
  EQUAL = "EQUAL",
  CUSTOM = "CUSTOM",
  PERCENTAGE = "PERCENTAGE",
}

export enum SettlementStatus {
  UNSETTLED = "UNSETTLED",
  PARTIAL = "PARTIAL",
  COMPLETE = "COMPLETE",
}

@Entity("expense_splits")
export class ExpenseSplitEntity extends TimeRecordEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @ManyToOne(() => ExpenseEntity, (expense) => expense.splits, {
    onDelete: "CASCADE",
  })
  expense: ExpenseEntity;

  @Column({ name: "expense_id" })
  expenseId: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ name: "user_id" })
  userId: string;

  @Column("decimal", { precision: 10, scale: 2, name: "amount" })
  amount: number;

  @Column("decimal", { precision: 5, scale: 2, name: "percentage" })
  percentage: number;

  @Column({
    type: "enum",
    enum: SplitType,
    default: SplitType.EQUAL,
    name: "split_type",
  })
  splitType: SplitType;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    default: 0,
    name: "settled_amount",
  })
  settledAmount: number;

  @Column({
    name: "settlement_status",
    type: "enum",
    enum: SettlementStatus,
    default: SettlementStatus.UNSETTLED,
  })
  settlementStatus: SettlementStatus;

  @OneToMany(() => PaymentSplitSettlementEntity, (pss) => pss.expenseSplit)
  paymentSettlements: PaymentSplitSettlementEntity[];
}
