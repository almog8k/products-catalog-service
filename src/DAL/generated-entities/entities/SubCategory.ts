import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Expense } from "./Expense";
import { Category } from "./Category";

@Index("sub_category_pkey", ["id"], { unique: true })
@Entity("sub_category", { schema: "public" })
export class SubCategory {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("text", { name: "name" })
  name: string;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Expense, (expense) => expense.subCategory)
  expenses: Expense[];

  @ManyToOne(() => Category, (category) => category.subCategories, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "id" }])
  category: Category;
}
