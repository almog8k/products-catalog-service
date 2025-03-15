import { z } from "zod";

export const GroupRole = {
  ADMIN: "admin",
  MEMBER: "member",
};

export type GroupRole = (typeof GroupRole)[keyof typeof GroupRole];

export const UserGroupStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

export type UserGroupStatus =
  (typeof UserGroupStatus)[keyof typeof UserGroupStatus];
