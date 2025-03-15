import { Application } from "express";
import { buildServer } from "./serverBuilder";
import { registerContainerDependencies } from "./common/containerRegistry";

export async function getApp(): Promise<Application> {
  const app = await buildServer();
  return app;
}
