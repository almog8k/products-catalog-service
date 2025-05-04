import express from "express";
import defineProductsRoutes from "./products/product-router";
import * as configurationProvider from "./common/configuration/configuration-provider";
import { Configuration } from "../config";
import { logger } from "./common/logger/logger-wrapper";
import { LOG_LEVEL } from "./common/logger/definition";
import helmet from "helmet";
import YAML from "yamljs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { getErrorHandlerMiddleware } from "./common/middlewares/error-handling-midleware";
import defineExpensesRoutes from "./expenses/routes/expenseRouter";
import defineCategoriesRoutes from "./categories/routes/categoryRouter";
import cors from "cors";
import defineGroupRoutes from "./groups/routes/groupRouter";
import { registerContainerDependencies } from "./common/containerRegistry";
import defineUsersRoutes from "./users/routes/userRoutes";
import { authenticate } from "./common/middlewares/authMiddleware";
const server: express.Application = express();

export async function buildServer(): Promise<express.Application> {
  setServerConfig();
  useCors();
  await registerContainerDependencies();
  registerPreRoutesMiddleWare();
  buildRoutes();
  await registerPostRoutesMiddleWare();

  return server;
}

function setServerConfig() {
  configurationProvider.initialize(Configuration);
  logger.configureLogger({
    prettyPrint: configurationProvider.getValue<boolean>("logger.prettyPrint"),
    level: configurationProvider.getValue<LOG_LEVEL>("logger.level"),
  });
}

function useCors(): void {
  server.use(cors({ origin: "*" }));
}

function buildRoutes(): void {
  server.use("/expense", authenticate, defineExpensesRoutes());
  server.use("/products", defineProductsRoutes());
  server.use("/categories", authenticate, defineCategoriesRoutes());
  server.use("/group", authenticate, defineGroupRoutes());
  server.use("/users", authenticate, defineUsersRoutes());
  buildDocsRoutes();
}

function buildDocsRoutes(): void {
  const openapiPath = configurationProvider.getValue<string>("openapi");
  const openapiDocument = YAML.load(openapiPath);
  server.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
}

function registerPreRoutesMiddleWare(): void {
  server.use(helmet());
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());
}

function registerPostRoutesMiddleWare(): void {
  server.use(getErrorHandlerMiddleware());
}
