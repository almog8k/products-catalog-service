import { Router } from "express";
import * as expenseController from "../controllers/expenseController";

export default function defineExpensesRoutes() {
  const router = Router();

  router.post("/", expenseController.createExpense);
  router.get("/", expenseController.getExpenses);
  router.get("/total", expenseController.getExpensesTotal);
  router.get("/:id", expenseController.getExpense);
  router.patch("/:id", expenseController.updateExpense);
  router.delete("/:id", expenseController.deleteExpense);
  router.get(
    "/exchangeRate/updateExchangeRate",
    expenseController.updateExchangeRate
  );
  router.get(
    "/groupBy/monthYear",
    expenseController.getExpensesGroupByMonthYear
  );

  return router;
}
