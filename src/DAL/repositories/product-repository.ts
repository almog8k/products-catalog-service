import * as dataManager from "../connectionManager";
import { ProductEntity } from "../entity/product-entity";
import * as productConverter from "../convertors/productModelConvertor";
import {
  CreateProductRequestBody,
  Polygon,
  Product,
  UpdateProductRequestBody,
} from "../../products/product-schema";
import { logger } from "../../common/logger/logger-wrapper";
import { DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { ProductFilter } from "../../products/product-filter-schema";
import {
  ProductGeoShapeFilterOperators,
  ProductOperator,
} from "../../products/product-enums";
import * as wkx from "wkx";
import { ResourceNotFoundError } from "../../common/errors/error-types";

export class ProductRepository extends Repository<ProductEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  public async createProduct(
    reqBody: CreateProductRequestBody
  ): Promise<string> {
    const entity = productConverter.createModelToEntity(reqBody);
    const res = await this.createQueryBuilder()
      .insert()
      .values(entity)
      .returning("id")
      .execute();
    return res.identifiers[0]["id"];
  }

  private async productExists(productId: string): Promise<boolean> {
    const recordCount = await this.count({ where: { id: productId } });
    return recordCount === 1;
  }

  public async deleteProduct(productId: string): Promise<void> {
    if (!(await this.productExists(productId))) {
      logger.error({
        msg: "Product was not found",
        metadata: { productId },
      });
      throw new ResourceNotFoundError(
        ` Product ${productId} was not found for delete request`
      );
    }
    await this.delete(productId);
  }

  public async updateProduct(
    productId: string,
    reqBody: UpdateProductRequestBody
  ): Promise<void> {
    if (!(await this.productExists(productId))) {
      logger.error({
        msg: "Product was not found",
        metadata: { productId },
      });
      throw new ResourceNotFoundError(
        ` Product ${productId} was not found for update request`
      );
    }
    const productEntity = productConverter.updateModelToEntity(reqBody);
    await this.update(productId, productEntity);
  }

  public async getProduct(productId: string): Promise<Product> {
    const res = await this.createQueryBuilder("product")
      .where("product.id = :id", { id: productId })
      .getOne();
    if (res === null) {
      logger.error({
        msg: "Product was not found",
        metadata: { productId },
      });
      throw new ResourceNotFoundError(`Product ${productId} was not found`);
    }
    const productModel = productConverter.getEntityToModel(res);
    return productModel;
  }

  public async getProducts(
    productFilters: ProductFilter[]
  ): Promise<Product[]> {
    const queryBuilder = this.createQueryBuilder("product");
    this.addFiltersToProductQueryBuilder(productFilters, queryBuilder);
    const res = await queryBuilder.getMany();
    const products = res.map((productEntity) =>
      productConverter.getEntityToModel(productEntity)
    );
    return products;
  }

  private addFiltersToProductQueryBuilder(
    filters: ProductFilter[],
    queryBuilder: SelectQueryBuilder<ProductEntity>
  ) {
    if (!filters) {
      return;
    }
    for (const filter of filters) {
      const { field, operator, value } = filter;
      const entityField = productConverter.modelToEntityFieldConverter(field);
      if (!entityField || !operator || !value) {
        continue;
      }
      let expression;
      if (this.isGeoShapeOperator(operator)) {
        expression = this.geoShapeFilterToWhereExpression(
          entityField,
          operator,
          value as Polygon
        );
      } else {
        const comparisonSign =
          productConverter.operatorComparisonMap.get(operator);
        expression = `product.${entityField}${comparisonSign}'${value}'`;
      }
      expression && queryBuilder.andWhere(expression);
    }
  }

  private isGeoShapeOperator(operator: ProductOperator) {
    return Object.values(ProductGeoShapeFilterOperators).includes(
      operator as ProductGeoShapeFilterOperators
    );
  }
  private geoShapeFilterToWhereExpression(
    column: string,
    operator: string,
    value: Polygon
  ): string {
    const textPolygon = wkx.Geometry.parseGeoJSON(value).toWkt();
    const SRID = 4326;
    const polygonWithSRID = `ST_SetSRID(ST_GeomFromText('${textPolygon}'), ${SRID})`;

    switch (operator) {
      case ProductGeoShapeFilterOperators.CONTAINS:
        return `ST_Contains(product.${column}, ${polygonWithSRID})`;
      case ProductGeoShapeFilterOperators.WITHIN:
        return `ST_Within(product.${column}, ${polygonWithSRID})`;
      case ProductGeoShapeFilterOperators.INTERSECTS:
        return `ST_Intersects(product.${column}, ${polygonWithSRID})`;
      default:
        throw new Error(`Invalid geo-shape filter: ${operator}`);
    }
  }
}

export const getRepository = async (): Promise<ProductRepository> => {
  const dataSource = await dataManager.getDataSource();
  return new ProductRepository(dataSource);
};
