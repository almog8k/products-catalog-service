import { Router } from "express";
import * as groupController from "../controllers/groupController";

export default function defineGroupRoutes() {
  const router = Router();

  router.get("/categories", groupController.getGroupTypes);
  router.post("/", groupController.createGroup);
  router.get("/me", groupController.getGroupsByUserId);
  router.put(
    "/:groupId/invitation/status",
    groupController.updateUserGroupStatus
  );

  return router;
}
