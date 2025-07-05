import { Router } from "express";
import { container } from "tsyringe";
import { ApartmentController } from "../controllers/apartmentController";

export default function defineApartmentRoutes() {
  const apartmentController = container.resolve(ApartmentController);
  const router = Router();

  router.get("/", apartmentController.getApartments);
  router.get("/:id", apartmentController.getApartment);
  router.put("/:id", apartmentController.updateApartment);

  return router;
}
