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
const server: express.Application = express();

export function buildServer(): express.Application {
  setServerConfig();
  useCors();
  registerPreRoutesMiddleWare();
  buildRoutes();
  registerPostRoutesMiddleWare();
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
  server.use("/expense", defineExpensesRoutes());
  server.use("/products", defineProductsRoutes());
  server.use("/categories", defineCategoriesRoutes());
  buildDocsRoutes();
}

function buildDocsRoutes(): void {
  const openapiPath = configurationProvider.getValue<string>("openapi");
  const openapiDocument = YAML.load(path.join(__dirname, openapiPath));
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
