import { ZodSchema, z } from "zod";
import { InvalidInputError } from "../errors/error-types";
import { logger } from "../logger/logger-wrapper";

export const typeValidator = <T extends z.ZodSchema>(
  typeToValidate: unknown,
  schema: T
): z.infer<T> => {
  logger.debug({ msg: "Validating type", metadata: { typeToValidate } });
  const validatedType = schema.safeParse(typeToValidate);
  if (!validatedType.success) {
    logger.error({
      msg: "Invalid type",
      metadata: { issues: validatedType.error.issues },
    });
    let issues = "";
    validatedType.error.issues.map((issue) => (issues += issue.message + " "));

    throw new InvalidInputError(
      `Invalid type: ${schema.description} ${issues}`
    );
  }
  logger.debug({
    msg: "Type is valid",
    metadata: { type: schema.description },
  });
  return validatedType.data as z.infer<typeof schema>;
};

export const reqQueryArrayParser = (
  query: string | string[]
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

export function stringToBoolean(value: string | undefined): boolean {
  if (value === undefined || value === null) return false;
  switch (value.toLowerCase()) {
    case "true":
    case "1":
    case "yes":
    case "y":
      return true;
    case "false":
    case "0":
    case "no":
    case "n":
      return false;
    default:
      return false;
  }
}
