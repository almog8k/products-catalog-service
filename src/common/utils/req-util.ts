import { InvalidInputError } from "../errors/error-types";
import { logger } from "../logger/logger-wrapper";

export const reqQueryArrayParser = (
  query: string | string[] | object
): Record<string, unknown>[] => {
  try {
    if (typeof query === "string") {
      const filter = JSON.parse(query);
      return [filter];
    } else if (Array.isArray(query)) {
      return query.map((item) => JSON.parse(item));
    }
    return [];
  } catch (err) {
    logger.error({ msg: err.message });
    throw new InvalidInputError(err.message);
  }
};
