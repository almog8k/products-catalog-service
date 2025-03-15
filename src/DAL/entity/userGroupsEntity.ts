import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GroupEntity } from "./groupEntity";
import { UserEntity } from "./userEntity";
import { GroupRole, UserGroupStatus } from "../../groups/constants/groupConsts";

@Entity("user_groups")
export class UserGroupsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ManyToOne(() => GroupEntity)
  @JoinColumn({ name: "group_id" })
  group: GroupEntity;

  @Column({
    name: "role",
    type: "enum",
    enum: GroupRole,
    default: GroupRole.MEMBER,
  })
  role: GroupRole;

  @Column({
    name: "status",
    type: "enum",
    enum: UserGroupStatus,
    default: UserGroupStatus.PENDING,
  })
  status: UserGroupStatus;

  @CreateDateColumn({
    name: "joined_at",
    type: "timestamp with time zone",
  })
  joinedAt: Date;
}
