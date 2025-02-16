import { RequestHandler } from "express";
import { logger } from "../../common/logger/logger-wrapper";

import * as util from "../../common/utils/util";
import * as categoryModel from "../models/categoryModel";
import httpStatus from "http-status-codes";
import { SubCategoryEntity } from "../../DAL/entity/subCategory";
import { Category, getCategoriesQuerySchema } from "../schemas/categorySchema";

type GetCategoryRequestParams = { withSubCategories: string };
type GetSubCategoryRequestParams = { withCategories: string };
type GetSubCategoriesHandler = RequestHandler<
  undefined,
  SubCategoryEntity[],
  undefined,
  GetSubCategoryRequestParams
>;
type GetCategoriesHandler = RequestHandler<
  undefined,
  Category[],
  undefined,
  GetCategoryRequestParams
>;

// type DeleteProductHandler = RequestHandler<
//   ProductRequestParams,
//   ProductOperationResponse
// >;

// type UpdateProductHandler = RequestHandler<
//   ProductRequestParams,
//   ProductOperationResponse,
//   UpdateProductRequestBody
// >;

// type GetProductsHandler = RequestHandler<undefined, Product[]>;

export const getSubCategories: GetSubCategoriesHandler = async (
  req,
  res,
  next
) => {
  logger.info({
    msg: `getting all sub categories`,
  });
  try {
    const withCategories = util.stringToBoolean(req.query.withCategories);

    logger.debug({
      msg: "Should get sub categories with categories",
      metadata: { withCategories },
    });
    const subCategories = await categoryModel.getSubCategories(withCategories);
    return res.status(httpStatus.OK).json(subCategories);
  } catch (error) {
    return next(error);
  }
};

export const getCategories: GetCategoriesHandler = async (req, res, next) => {
  logger.info({
    msg: `getting all categories`,
  });
  try {
    const validQuery = util.typeValidator(req.query, getCategoriesQuerySchema);
    const withSubCategories = util.stringToBoolean(
      validQuery.withSubCategories
    );
    logger.debug({
      msg: "Should get categories with subCategories",
      metadata: { withSubCategories },
    });
    const categories = await categoryModel.getCategories(withSubCategories);
    return res.status(httpStatus.OK).json(categories);
  } catch (error) {
    return next(error);
  }
};

// export const deleteExpense: DeleteProductHandler = async (req, res, next) => {
//   logger.info({
//     msg: `Geo spatial catalog service was called to delete a product`,
//     metadata: { productId: req.params.id },
//   });
//   try {
//     const reqParams = productValidator.validateProductRequestParams(req.params);

//     await productModel.deleteProduct(reqParams);
//     return res.status(httpStatus.NO_CONTENT).json({ id: reqParams.id });
//   } catch (error) {
//     return next(error);
//   }
// };

// export const updateExpense: UpdateProductHandler = async (req, res, next) => {
//   logger.info({
//     msg: `Geo spatial catalog service was called to update a product`,
//     metadata: { productId: req.params.id },
//   });
//   try {
//     const reqParams = productValidator.validateProductRequestParams(req.params);
//     const reqBody = productValidator.validateUpdateProductReqBody(req.body);
//     await productModel.updateProduct(reqParams, reqBody);
//     return res.status(httpStatus.OK).json({ id: reqParams.id });
//   } catch (error) {
//     return next(error);
//   }
// };

// export const getExpense: GetProductHandler = async (req, res, next) => {
//   logger.info({
//     msg: `Geo spatial catalog service was called to get a product`,
//     metadata: { productId: req.params.id },
//   });
//   try {
//     const reqParams = productValidator.validateProductRequestParams(req.params);
//     const ProductResponse = await productModel.getProduct(reqParams);
//     return res.status(httpStatus.OK).json(ProductResponse);
//   } catch (error) {
//     return next(error);
//   }
// };

// export const getExpenses: GetProductsHandler = async (req, res, next) => {
//   try {
//     logger.info({
//       msg: `Geo spatial catalog service was called to get products by query`,
//       metadata: { query: req.query },
//     });

//     const validatedQuery = productValidator.validateProductRequestQuery(
//       req.query
//     );

//     let parsedFilters: Record<string, unknown>[] = [];
//     if (validatedQuery?.filters) {
//       parsedFilters = reqQueryArrayParser(validatedQuery?.filters);
//     }

//     const validFilters = productValidator.validateProductFilters(parsedFilters);
//     const ProductResponse = await productModel.getProducts(validFilters);
//     return res.status(httpStatus.OK).json(ProductResponse);
//   } catch (error) {
//     return next(error);
//   }
// }
