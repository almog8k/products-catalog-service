import { Router } from "express";
import * as productController from "./product-controller";

export default function defineProductsRoutes() {
  const router = Router();

  router.post("/", productController.createProduct);
  router.get("/", productController.getProducts);
  router.get("/:id", productController.getProduct);
  router.patch("/:id", productController.updateProduct);
  router.delete("/:id", productController.deleteProduct);

  return router;
}
