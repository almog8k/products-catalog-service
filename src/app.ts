import { Application } from "express";
import { buildServer } from "./serverBuilder";

export function getApp(): Application {
  const app = buildServer();
  return app;
}
