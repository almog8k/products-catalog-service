import z from "zod";
import { ExpenseEntity } from "../../DAL/entity/expenseEntity";

export const PolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
});

export type Polygon = z.infer<typeof PolygonSchema>;

export const ExpenseSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    description: z.string().max(250),
    price: z.number().min(0.01),
    currency: z.string().length(3),
    categoryId: z.string().uuid(),
    subCategoryId: z.string().uuid(),
    imageUrl: z.string().url().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .describe("Expense");

export type Expense = z.infer<typeof ExpenseSchema>;

export const NewExpenseSchema = ExpenseSchema.omit({
  id: true,
  updatedAt: true,
}).describe("NewExpense");

export type NewExpense = z.infer<typeof NewExpenseSchema>;

export const UpdateExpenseSchema = NewExpenseSchema.partial()
  .strict()
  .describe("UpdateExpense");

export type UpdateExpense = z.infer<typeof UpdateExpenseSchema>;

export type GroupedExpenseDto = {
  monthYear: string;
  expenses: Expense[];
  totalSum: TotalSum;
};

export type TotalSum = { sum: number; currency: string };
