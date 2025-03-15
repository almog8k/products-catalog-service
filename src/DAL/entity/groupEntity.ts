import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GroupTypeEntity } from "./groupTypeEntity";
import { TimeRecordEntity } from "./timeRecordEntity";

@Entity("group")
export class GroupEntity extends TimeRecordEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => GroupTypeEntity)
  @JoinColumn({ name: "type_id", referencedColumnName: "id" })
  type: GroupTypeEntity;

  @Column({ name: "name", type: "varchar" })
  name: string;
}
