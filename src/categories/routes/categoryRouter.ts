import { Router } from "express";
import * as categoryController from "../controllers/categoryController";

export default function defineCategoriesRoutes() {
  const router = Router();

  router.get("/subCategories", categoryController.getSubCategories);
  router.get("/", categoryController.getCategories);
  //   router.get("/", productController.getProducts);
  //   router.get("/:id", productController.getProduct);
  //   router.patch("/:id", productController.updateProduct);
  //   router.delete("/:id", productController.deleteProduct);

  return router;
}
