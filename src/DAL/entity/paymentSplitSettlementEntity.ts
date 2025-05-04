// src/entities/PaymentSplitSettlement.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { TimeRecordEntity } from "./timeRecordEntity";
import { PaymentSettlementEntity } from "./paymentSettlementEntity";
import { ExpenseSplitEntity } from "./expenseSplitEntity";

@Entity({ name: "payment_split_settlements" })
export class PaymentSplitSettlementEntity extends TimeRecordEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => PaymentSettlementEntity, (ps) => ps.splitSettlements, {
    onDelete: "CASCADE",
  })
  paymentSettlement: PaymentSettlementEntity;

  @Column()
  paymentSettlementId: string;

  @ManyToOne(() => ExpenseSplitEntity, (es) => es.paymentSettlements, {
    onDelete: "CASCADE",
  })
  expenseSplit: ExpenseSplitEntity;

  @Column()
  expenseSplitId: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;
}
