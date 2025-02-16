import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from "typeorm";

@Entity("expense")
export class ExpenseEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  @Generated("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @Column({ name: "description", type: "varchar" })
  description: string;

  @Column({ name: "price", type: "float" })
  price: number;

  @Column({ name: "currency", type: "varchar", length: 3 })
  currency: string;

  @Column({ name: "category_id", type: "uuid" })
  categoryId: string;

  @Column({ name: "sub_category_id", type: "uuid" })
  subCategoryId: string;

  @Column({ name: "image_url", type: "varchar", nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: string;
}
