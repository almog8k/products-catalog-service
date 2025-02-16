import { ConfigSchema } from "./src/common/configuration/configuration-schema";

export const Configuration: ConfigSchema = {
  port: {
    doc: "The API listening port. By default is 0 (ephemeral) which serves as a dynamic port for testing purposes. For production use, a specific port must be assigned",
    format: "Number",
    default: 8080,
    nullable: true,
    env: "PORT",
  },
  logger: {
    level: {
      doc: "Which type of logger entries should actually be written to the target medium (e.g., stdout)",
      format: ["debug", "info", "warn", "error", "critical"],
      default: "debug",
      nullable: false,
      env: "LOGGER_LEVEL",
    },
    prettyPrint: {
      doc: "Weather the logger should be configured to pretty print the output",
      format: "Boolean",
      default: true,
      nullable: false,
      env: "PRETTY_PRINT_LOG",
    },
  },
  DB: {
    type: {
      doc: "The DB type name",
      format: "String",
      default: "postgres",
      nullable: false,
      env: "DB_TYPE",
    },
    username: {
      doc: "The DB connection user name",
      format: "String",
      default: "postgres.rshfxkwssnjrdqyvapdi",
      nullable: false,
      env: "DB_USER",
    },
    port: {
      doc: "The DB port",
      format: "Number",
      default: 6543,
      nullable: false,
      env: "DB_PORT",
    },
    host: {
      doc: "The DB cluster URL",
      format: "String",
      default: "aws-0-eu-central-1.pooler.supabase.com",
      nullable: false,
      env: "DB_HOST",
    },
    password: {
      doc: "The DB connection password. Don't put production code here",
      format: "String",
      default: "Ak208753996!",
      nullable: false,
      env: "DB_PASSWORD",
    },
    database: {
      doc: "The default database name",
      format: "String",
      default: "postgres",
      nullable: false,
      env: "DB_NAME",
    },
  },
  openapi: {
    doc: "The default openapi file path",
    format: "String",
    default: "./expenses/openapi.yaml",
    env: "OPENAPI_PATH",
    nullable: true,
  },
  externalServices: {
    conversionRates: {
      url: {
        doc: "The currency converter service URL",
        format: "String",
        default:
          "https://v6.exchangerate-api.com/v6/67027b133b370ed0e82c824d/latest/USD",
        env: "CURRENCY_CONVERTER_URL",
        nullable: false,
      },
    },
  },
};
