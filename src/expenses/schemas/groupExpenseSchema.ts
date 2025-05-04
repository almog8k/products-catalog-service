import { z } from "zod";
import { currencySchema } from "./commonSchema";
import { SplitType } from "../../DAL/entity/expenseSplitEntity";
import { ExpenseSchema, newExpenseSchema } from "./expenseSchema";

const baseExpenseSplitSchema = z.object({
  userId: z.string().uuid(),
  splitType: z.nativeEnum(SplitType),
});

export const calculatedGroupExpenseSplitsSchema = baseExpenseSplitSchema
  .extend({
    expenseId: z.string().uuid(),
    amount: z.number().min(0.01),
    percentage: z.number().min(0).max(100),
  })
  .describe("CalculatedSplits");

export type CalculatedGroupExpenseSplit = z.infer<
  typeof calculatedGroupExpenseSplitsSchema
>;

const expenseSplitSchema = calculatedGroupExpenseSplitsSchema.omit({
  expenseId: true,
});

// Create the complete schema with conditional validation
export const newExpenseSplitSchema = z.discriminatedUnion("splitType", [
  // For EQUAL type - both amount and percentage are optional
  baseExpenseSplitSchema.extend({
    splitType: z.literal(SplitType.EQUAL),
    amount: z.number().min(0.01).optional(),
    percentage: z.number().min(0).max(100).optional(),
  }),

  // For CUSTOM type - amount is required, percentage is optional
  baseExpenseSplitSchema.extend({
    splitType: z.literal(SplitType.CUSTOM),
    amount: z.number().min(0.01),
    percentage: z.number().min(0).max(100).optional(),
  }),

  // For PERCENTAGE type - percentage is required, amount is optional
  baseExpenseSplitSchema.extend({
    splitType: z.literal(SplitType.PERCENTAGE),
    percentage: z.number().min(0).max(100),
    amount: z.number().min(0.01).optional(),
  }),
]);

export const newGroupExpenseSchema = z.object({
  expense: newExpenseSchema.extend({
    groupId: z.string().uuid(),
  }),
  splits: z.array(newExpenseSplitSchema),
});

export type NewGroupExpense = z.infer<typeof newGroupExpenseSchema>;

export const groupExpenseSchema = z.object({
  expense: ExpenseSchema,
  splits: z.array(expenseSplitSchema),
});

export type GroupExpense = z.infer<typeof groupExpenseSchema>;

export type GroupExpenseSplits = NewGroupExpense["splits"];
