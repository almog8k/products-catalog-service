import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Expense } from "./Expense";
import { GroupTypes } from "./GroupTypes";
import { UserGroups } from "./UserGroups";

@Index("group_pkey", ["id"], { unique: true })
@Entity("group", { schema: "public" })
export class Group {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "name" })
  name: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses: Expense[];

  @ManyToOne(() => GroupTypes, (groupTypes) => groupTypes.groups, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "type_id", referencedColumnName: "id" }])
  type: GroupTypes;

  @OneToMany(() => UserGroups, (userGroups) => userGroups.group)
  userGroups: UserGroups[];
}
