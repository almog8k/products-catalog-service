import { Expense, NewExpense } from "../../expenses/schemas/expenseSchema";
import { ExpenseEntity } from "../entity/expenseEntity";

// export const createExpenseEntity = (model: NewExpense): ExpenseEntity => {
//   return ExpenseEntity.create({
//     description: model.description,
//     price: model.price,
//     currency: model.currency,
//     category_id: model.categoryId,
//     sub_category_id: model.subCategoryId,
//     image_url: model.imageUrl,
//   });
// };

// export const createExpenseModel = (entity: ExpenseEntity): Expense => {
//   return {
//     id: entity.id,
//     description: entity.description,
//     price: entity.price,
//     currency: entity.currency,
//     categoryId: entity.categoryId,
//     subCategoryId: entity.subCategoryId,
//     imageUrl: entity.imageUrl,
//     createdAt: entity.createdAt.toISOString(),
//     updatedAt: entity.updatedAt.toISOString(),
// //   };
// };
