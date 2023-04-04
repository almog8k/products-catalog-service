import {
  ProductUUIDSchema,
  CreateProductRequestBody,
  ProductRequestParams,
  CreateProductSchema,
  UpdateProductRequestBody,
  UpdateProductSchema,
  ProductRequestQuery,
  ProductRequestQuerySchema,
} from "./product-schema";
import { logger } from "../common/logger/logger-wrapper";
import { ProductFiltersSchema, ProductFilter } from "./product-filter-schema";
import { InvalidInputError } from "../common/errors/error-types";

export const validateProductReqBody = (reqBody): CreateProductRequestBody => {
  logger.debug({ msg: "Validating product request body" });
  const validatedProduct = CreateProductSchema.safeParse(reqBody);
  if (!validatedProduct.success) {
    logger.error({
      msg: "Invalid product",
      metadata: { issues: validatedProduct.error.issues },
    });
    throw new InvalidInputError("Invalid product");
  }
  logger.debug({ msg: "Product is valid" });
  return validatedProduct.data;
};

export const validateUpdateProductReqBody = (
  reqBody
): UpdateProductRequestBody => {
  logger.debug({ msg: "Validating product request body" });
  const validatedProduct = UpdateProductSchema.safeParse(reqBody);
  if (!validatedProduct.success) {
    logger.error({
      msg: "Invalid product",
      metadata: { issues: validatedProduct.error.issues },
    });
    throw new InvalidInputError("Invalid Product to update");
  }
  logger.debug({ msg: "Product to update is valid" });
  return validatedProduct.data;
};

export const validateProductRequestParams = (
  reqParams
): ProductRequestParams => {
  logger.debug({ msg: "Validating product request params" });
  const validatedParams = ProductUUIDSchema.safeParse(reqParams);
  if (!validatedParams.success) {
    logger.error({
      msg: "Invalid request params",
      metadata: { reqParams, issues: validatedParams.error.issues },
    });
    throw new InvalidInputError("Invalid product request params");
  }
  logger.debug({ msg: "Product request params are valid" });
  return validatedParams.data;
};

export const validateProductRequestQuery = (reqQuery): ProductRequestQuery => {
  logger.debug({ msg: "Validating product request query" });

  const validatedQuery = ProductRequestQuerySchema.safeParse(reqQuery);
  if (!validatedQuery.success) {
    logger.error({
      msg: "Invalid request query",
      metadata: { reqQuery, issues: validatedQuery.error.issues },
    });
    throw new InvalidInputError("Invalid product request query");
  }
  logger.debug({ msg: "Product request query is valid" });
  return validatedQuery.data;
};

export const validateProductFilters = (reqQueryParams): ProductFilter[] => {
  logger.debug({ msg: "Validating product filters" });

  const validatedFilters = ProductFiltersSchema.safeParse(reqQueryParams);
  if (!validatedFilters.success) {
    logger.error({
      msg: "Invalid product filters",
      metadata: { reqQueryParams, issues: validatedFilters.error.issues },
    });
    throw new InvalidInputError("Invalid product filters");
  }
  logger.debug({ msg: "Product filters are valid" });
  return validatedFilters.data;
};
