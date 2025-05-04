// src/entities/PaymentSettlement.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TimeRecordEntity } from "./timeRecordEntity";
import { UserEntity } from "./userEntity";
import { GroupEntity } from "./groupEntity";
import { PaymentSplitSettlementEntity } from "./paymentSplitSettlementEntity";

@Entity({ name: "payment_settlements" })
export class PaymentSettlementEntity extends TimeRecordEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity)
  payer: UserEntity;

  @Column()
  payerId: string;

  @ManyToOne(() => UserEntity)
  payee: UserEntity;

  @Column()
  payeeId: string;

  @ManyToOne(() => GroupEntity, { nullable: true })
  group: GroupEntity;

  @Column({ nullable: true })
  groupId: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ default: "other" })
  paymentMethod: string;

  @Column({ nullable: true })
  referenceNumber: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "timestamp" })
  paymentDate: Date;

  @Column("decimal", { precision: 10, scale: 6, default: 1.0 })
  exchangeRate: number;

  @OneToMany(() => PaymentSplitSettlementEntity, (pss) => pss.paymentSettlement)
  splitSettlements: PaymentSplitSettlementEntity[];
}
