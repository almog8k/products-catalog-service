import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { CategoryEntity } from "./categoryEntity";
import { ExpenseEntity } from "./expenseEntity";

@Index("sub_category_pkey", ["id"], { unique: true })
@Entity("sub_category", { schema: "public" })
export class SubCategoryEntity extends BaseEntity {
  @PrimaryColumn("uuid")
  @Generated("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @OneToOne(() => CategoryEntity, (category) => category.subCategories)
  @JoinColumn({ name: "category_id", referencedColumnName: "id" })
  category?: CategoryEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;
}
