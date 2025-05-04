import { Column, Entity, Index, OneToMany } from "typeorm";
import { Group } from "./Group";

@Index("group_types_pkey", ["id"], { unique: true })
@Index("group_types_group_type_name_key", ["name"], { unique: true })
@Entity("group_types", { schema: "public" })
export class GroupTypes {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "name", unique: true })
  name: string;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @OneToMany(() => Group, (group) => group.type)
  groups: Group[];
}
