import { Router } from "express";
import * as groupController from "../controllers/groupController";

export default function defineGroupRoutes() {
  const router = Router();

  router.get("/categories", groupController.getGroupTypes);
  router.post("/", groupController.createGroup);
  router.get("/me", groupController.getGroupsByUserId);
  router.get("/:groupId", groupController.getGroupById);
  router.get("/:groupId/participants", groupController.getGroupParticipants);
  router.put(
    "/:groupId/invitation/status",
    groupController.updateUserGroupStatus
  );
  router.post("/:groupId/invitation", groupController.inviteUserToGroup);

  return router;
}
