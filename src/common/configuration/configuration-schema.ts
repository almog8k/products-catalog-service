import { LOG_LEVEL } from "../logger/definition";

export type ConfigSchema = {
  port: {
    doc: string;
    format: "Number";
    default: number;
    nullable: boolean;
    env: string;
  };
  DB: {
    type: {
      doc: string;
      format: "String";
      default: string;
      nullable: boolean;
      env: string;
    };
    database: {
      doc: string;
      format: "String";
      default: string;
      nullable: boolean;
      env: string;
    };
    port: {
      doc: string;
      format: "Number";
      default: number;
      nullable: boolean;
      env: string;
    };
    host: {
      doc: string;
      format: "String";
      default: string;
      nullable: boolean;
      env: string;
    };
    username: {
      doc: string;
      format: "String";
      default: string;
      nullable: boolean;
      env: string;
    };
    password: {
      doc: string;
      format: "String";
      default: string;
      nullable: false;
      env: string;
    };
  };
  logger: {
    level: {
      doc: string;
      format: LOG_LEVEL[];
      default: LOG_LEVEL;
      nullable: boolean;
      env: string;
    };
    prettyPrint: {
      doc: string;
      format: "Boolean";
      default: boolean;
      nullable: boolean;
      env: string;
    };
  };
  openapi: {
    doc: string;
    format: "String";
    default: string;
    nullable: boolean;
    env: string;
  };
};
