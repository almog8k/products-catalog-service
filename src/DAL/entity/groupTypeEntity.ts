import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TimeRecordEntity } from "./timeRecordEntity";

@Entity("group_types")
export class GroupTypeEntity extends TimeRecordEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", type: "varchar" })
  name: string;
}
