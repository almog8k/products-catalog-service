import { Router } from "express";
import * as userController from "../controllers/userController";
export default function defineUsersRoutes() {
  const router = Router();

  router.get("/authenticated", userController.getAllAuthenticatedUsers);

  return router;
}
