import { logger } from "../common/logger/logger-wrapper";
import * as productRepository from "../DAL/repositories/product-repository";
import { ProductFilter } from "./product-filter-schema";
import {
  CreateProductRequestBody,
  Product,
  ProductRequestParams,
  UpdateProductRequestBody,
} from "./product-schema";

export async function createProduct(
  reqBody: CreateProductRequestBody
): Promise<Product> {
  logger.info({ msg: "Creating Product" });
  const repo = await productRepository.getRepository();
  const id = await repo.createProduct(reqBody);
  const createdProduct: Product = { id, ...reqBody };
  return createdProduct;
}

export async function deleteProduct(
  reqParams: ProductRequestParams
): Promise<void> {
  logger.info({
    msg: "Deleting Product",
    metadata: { productId: reqParams.id },
  });
  const repo = await productRepository.getRepository();

  await repo.deleteProduct(reqParams.id);
}

export async function updateProduct(
  reqParams: ProductRequestParams,
  reqBody: UpdateProductRequestBody
): Promise<void> {
  logger.info({
    msg: "Updating Product",
    metadata: { productId: reqParams.id },
  });
  const repo = await productRepository.getRepository();
  await repo.updateProduct(reqParams.id, reqBody);
}

export async function getProduct(
  reqParams: ProductRequestParams
): Promise<Product> {
  logger.info({
    msg: "getting Product",
    metadata: { productId: reqParams.id },
  });
  const repo = await productRepository.getRepository();
  const product = await repo.getProduct(reqParams.id);
  return product;
}

export async function getProducts(
  filters: ProductFilter[]
): Promise<Product[]> {
  logger.info({
    msg: "getting filtered Products",
    metadata: { filters },
  });

  const repo = await productRepository.getRepository();
  const products = await repo.getProducts(filters);
  return products;
}
