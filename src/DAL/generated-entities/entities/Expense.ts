import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Category } from "./Category";
import { Group } from "./Group";
import { SubCategory } from "./SubCategory";

@Index("expense_pkey", ["id"], { unique: true })
@Entity("expense", { schema: "public" })
export class Expense {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("double precision", { name: "price", precision: 53 })
  price: number;

  @Column("text", { name: "currency" })
  currency: string;

  @Column("text", { name: "image_url", nullable: true })
  imageUrl: string | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "(now() AT TIME ZONE 'utc')",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "(now() AT TIME ZONE 'utc')",
  })
  updatedAt: Date;

  @Column("uuid", { name: "user_id", default: () => "auth.uid()" })
  userId: string;

  @Column("boolean", { name: "is_group_expense", default: () => "false" })
  isGroupExpense: boolean;

  @ManyToOne(() => Category, (category) => category.expenses)
  @JoinColumn([{ name: "category_id", referencedColumnName: "id" }])
  category: Category;

  @ManyToOne(() => Group, (group) => group.expenses)
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.expenses)
  @JoinColumn([{ name: "sub_category_id", referencedColumnName: "id" }])
  subCategory: SubCategory;
}
