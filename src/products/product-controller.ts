import { RequestHandler } from "express";
import { logger } from "../common/logger/logger-wrapper";
import {
  CreateProductRequestBody,
  Product,
  ProductOperationResponse,
  ProductRequestParams,
  UpdateProductRequestBody,
} from "./product-schema";
import * as productValidator from "./product-validator";
import * as productModel from "./product-model";
import httpStatus from "http-status-codes";
import { ProductFilters } from "./product-filter-schema";
import { reqQueryArrayParser } from "../common/utils/req-util";

type CreateProductHandler = RequestHandler<
  undefined,
  Product,
  CreateProductRequestBody
>;

type DeleteProductHandler = RequestHandler<
  ProductRequestParams,
  ProductOperationResponse
>;

type UpdateProductHandler = RequestHandler<
  ProductRequestParams,
  ProductOperationResponse,
  UpdateProductRequestBody
>;

type GetProductHandler = RequestHandler<ProductRequestParams, Product>;
type GetProductsHandler = RequestHandler<undefined, Product[]>;

export const createProduct: CreateProductHandler = async (req, res, next) => {
  logger.info({
    msg: `Geo spatial catalog service was called to create new product`,
    metadata: { reqBody: req.body },
  });
  try {
    const reqBody = productValidator.validateProductReqBody(req.body);
    const createdProduct = await productModel.createProduct(reqBody);
    return res.status(httpStatus.CREATED).json(createdProduct);
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct: DeleteProductHandler = async (req, res, next) => {
  logger.info({
    msg: `Geo spatial catalog service was called to delete a product`,
    metadata: { productId: req.params.id },
  });
  try {
    const reqParams = productValidator.validateProductRequestParams(req.params);

    await productModel.deleteProduct(reqParams);
    return res.status(httpStatus.NO_CONTENT).json({ id: reqParams.id });
  } catch (error) {
    return next(error);
  }
};

export const updateProduct: UpdateProductHandler = async (req, res, next) => {
  logger.info({
    msg: `Geo spatial catalog service was called to update a product`,
    metadata: { productId: req.params.id },
  });
  try {
    const reqParams = productValidator.validateProductRequestParams(req.params);
    const reqBody = productValidator.validateUpdateProductReqBody(req.body);
    await productModel.updateProduct(reqParams, reqBody);
    return res.status(httpStatus.OK).json({ id: reqParams.id });
  } catch (error) {
    return next(error);
  }
};

export const getProduct: GetProductHandler = async (req, res, next) => {
  logger.info({
    msg: `Geo spatial catalog service was called to get a product`,
    metadata: { productId: req.params.id },
  });
  try {
    const reqParams = productValidator.validateProductRequestParams(req.params);
    const ProductResponse = await productModel.getProduct(reqParams);
    return res.status(httpStatus.OK).json(ProductResponse);
  } catch (error) {
    return next(error);
  }
};

export const getProducts: GetProductsHandler = async (req, res, next) => {
  try {
    logger.info({
      msg: `Geo spatial catalog service was called to get products by query`,
      metadata: { query: req.query },
    });

    const validatedQuery = productValidator.validateProductRequestQuery(
      req.query
    );

    let parsedFilters: Record<string, unknown>[] = [];
    if (validatedQuery?.filters) {
      parsedFilters = reqQueryArrayParser(validatedQuery?.filters);
    }

    const validFilters = productValidator.validateProductFilters(parsedFilters);
    const ProductResponse = await productModel.getProducts(validFilters);
    return res.status(httpStatus.OK).json(ProductResponse);
  } catch (error) {
    return next(error);
  }
};
