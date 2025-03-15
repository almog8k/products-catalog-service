import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity({ name: "users", schema: "auth" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, type: "uuid", name: "instance_id" })
  @Index("users_instance_id_idx")
  @Index("users_instance_id_email_idx") // Part of composite index with email
  instanceId: string;

  @Column({ nullable: true, length: 255 })
  aud: string;

  @Column({ nullable: true, length: 255 })
  role: string;

  @Column({ nullable: true, length: 255 })
  @Index("users_email_partial_key", {
    unique: true,
    where: "is_sso_user = false",
  })
  @Index("users_instance_id_email_idx")
  email: string;

  @Column({ nullable: true, length: 255, name: "encrypted_password" })
  password: string;

  @Column({
    nullable: true,
    type: "timestamp with time zone",
    name: "email_confirmed_at",
  })
  emailConfirmedAt: Date;

  @Column({
    nullable: true,
    type: "timestamp with time zone",
    name: "last_sign_in_at",
  })
  lastSignInAt: Date;

  @Column({ nullable: true, type: "jsonb", name: "raw_app_meta_data" })
  rawAppMetaData: any;

  @Column({ nullable: true, type: "jsonb", name: "raw_user_meta_data" })
  rawUserMetaData: any;

  @Column({ nullable: true, default: false, name: "is_super_admin" })
  isSuperAdmin: boolean;

  @CreateDateColumn({
    type: "timestamp with time zone",
    nullable: true,
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp with time zone",
    nullable: true,
    name: "updated_at",
  })
  updatedAt: Date;

  @Column({ nullable: true, type: "text" })
  @Index("users_phone_key", { unique: true })
  phone: string;

  @Column({
    nullable: true,
    type: "timestamp with time zone",
    name: "phone_confirmed_at",
  })
  phoneConfirmedAt: Date;

  @Column({
    nullable: true,
    type: "timestamp with time zone",
    generatedType: "STORED",
    asExpression: "LEAST(email_confirmed_at, phone_confirmed_at)",
    name: "confirmed_at",
  })
  confirmedAt: Date;

  @Column({
    nullable: true,
    type: "timestamp with time zone",
    name: "banned_until",
  })
  bannedUntil: Date;

  @Column({ nullable: false, default: false, name: "is_sso_user" })
  isSsoUser: boolean;

  @DeleteDateColumn({
    nullable: true,
    type: "timestamp with time zone",
    name: "deleted_at",
  })
  deletedAt: Date;

  @Column({ nullable: false, default: false, name: "is_anonymous" })
  @Index("users_is_anonymous_idx")
  isAnonymous: boolean;

  @Column({
    nullable: true,
    type: "smallint",
    default: 0,
    name: "email_change_confirm_status",
  })
  @Check(
    "(email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)"
  )
  emailChangeConfirmStatus: number;

  // Recovery and authentication tokens
  @Column({ nullable: true, length: 255, name: "recovery_token" })
  @Index("recovery_token_idx", {
    unique: true,
    where: "recovery_token::text !~ '^[0-9 ]*$'::text",
  })
  recoveryToken: string;

  @Column({ nullable: true, length: 255, name: "confirmation_token" })
  @Index("confirmation_token_idx", {
    unique: true,
    where: "confirmation_token::text !~ '^[0-9 ]*$'::text",
  })
  confirmationToken: string;

  @Column({
    nullable: true,
    length: 255,
    default: "",
    name: "reauthentication_token",
  })
  @Index("reauthentication_token_idx", {
    unique: true,
    where: "reauthentication_token::text !~ '^[0-9 ]*$'::text",
  })
  reauthenticationToken: string;
}
