import { Column, Entity, Index, OneToMany } from "typeorm";
import { Expense } from "./Expense";
import { SubCategory } from "./SubCategory";

@Index("category_10dd08f1-02e9-40fa-a483-a6a85b12a308_key", ["id"], {
  unique: true,
})
@Index("category_pkey", ["id"], { unique: true })
@Index("category_Entertainment_key", ["name"], { unique: true })
@Entity("category", { schema: "public" })
export class Category {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "name", unique: true })
  name: string;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategories: SubCategory[];
}
