import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Group } from "./Group";

@Index("user_groups_pkey", ["id"], { unique: true })
@Entity("user_groups", { schema: "public" })
export class UserGroups {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "user_id", default: () => "gen_random_uuid()" })
  userId: string;

  @Column("enum", {
    name: "role",
    enum: ["admin", "member"],
    default: () => "'member'",
  })
  role: "admin" | "member";

  @Column("timestamp with time zone", {
    name: "joined_at",
    default: () => "(now() AT TIME ZONE 'utc')",
  })
  joinedAt: Date;

  @Column("enum", {
    name: "status",
    enum: ["pending", "accepted", "rejected"],
    default: () => "'pending'",
  })
  status: "pending" | "accepted" | "rejected";

  @ManyToOne(() => Group, (group) => group.userGroups, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group;
}
