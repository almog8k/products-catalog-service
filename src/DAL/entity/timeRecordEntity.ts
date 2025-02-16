import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from "typeorm";

@Entity("time_records")
export class TimeRecordEntity extends BaseEntity {
  @CreateDateColumn({ type: "timestamp with time zone", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", name: "updated_at" })
  updatedAt: Date;
}
