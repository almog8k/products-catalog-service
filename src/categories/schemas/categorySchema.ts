import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Category = z.infer<typeof categorySchema>;

export const subCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: categorySchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type SubCategory = z.infer<typeof subCategorySchema>;

export const getCategoriesQuerySchema = z.object({
  withSubCategories: z.string().optional(),
});
