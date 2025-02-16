import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { CategoryEntity } from "./categoryEntity";

@Entity("sub_category")
export class SubCategoryEntity extends BaseEntity {
  @PrimaryColumn("uuid")
  @Generated("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @OneToOne(() => CategoryEntity, (category) => category.subCategories)
  @JoinColumn({ name: "category_id" })
  category?: CategoryEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;
}
