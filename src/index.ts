import { getApp } from "./app";
import * as configurationProvider from "./common/configuration/configuration-provider";
import { errorHandler } from "./common/errors/error-handler";
import { logger } from "./common/logger/logger-wrapper";
import { createServer } from "http";

const app = getApp();
const port = configurationProvider.getValue<number>("port");
const server = createServer(app);

server.listen(port, () => {
  errorHandler.listenToErrorEvents(server);
  logger.info({ msg: `App started on port ${port}` });
});
