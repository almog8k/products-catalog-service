import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { SubCategoryEntity } from "./subCategory";

@Entity("category")
export class CategoryEntity extends BaseEntity {
  @PrimaryColumn("uuid")
  @Generated("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @OneToMany(() => SubCategoryEntity, (subCategory) => subCategory.category)
  subCategories?: SubCategoryEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;
}
