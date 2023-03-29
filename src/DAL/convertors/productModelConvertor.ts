import {
  CreateProductRequestBody,
  Polygon,
  Product,
  UpdateProductRequestBody,
} from "../../products/product-schema";
import { ProductEntity } from "../entity/product-entity";
import { v4 } from "uuid";
import { ConsumptionProtocol, ProductType } from "../../products/product-enums";

export const createModelToEntity = (
  model: CreateProductRequestBody
): ProductEntity => {
  return ProductEntity.create({
    id: v4(),
    name: model.name,
    description: model.description,
    bounding_polygon: model.boundingPolygon,
    consumption_link: model.consumptionLink,
    type: model.type,
    consumption_protocol: model.consumptionProtocol,
    resolution_best: model.resolutionBest,
    min_zoom: model.minZoom,
    max_zoom: model.maxZoom,
  });
};

export const updateModelToEntity = (
  model: UpdateProductRequestBody
): ProductEntity => {
  return ProductEntity.create({
    name: model.name,
    description: model.description,
    bounding_polygon: model.boundingPolygon,
    consumption_link: model.consumptionLink,
    type: model.type,
    consumption_protocol: model.consumptionProtocol,
    resolution_best: model.resolutionBest,
    min_zoom: model.minZoom,
    max_zoom: model.maxZoom,
  });
};

export const getEntityToModel = (entity: ProductEntity): Product => {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    boundingPolygon: entity.bounding_polygon as Polygon,
    consumptionLink: entity.consumption_link,
    type: entity.type as ProductType,
    consumptionProtocol: entity.consumption_protocol as ConsumptionProtocol,
    resolutionBest: entity.resolution_best,
    maxZoom: entity.max_zoom,
    minZoom: entity.min_zoom,
  };
};

export const modelToEntityFieldConverter = (field: string): string => {
  let result = "";
  const len = field.length;
  for (let i = 0; i < len; i++) {
    const c = field.charAt(i);
    if (c.toUpperCase() === c && i > 0) {
      result += "_";
      result += c.toLowerCase();
    } else {
      result += c;
    }
  }
  return result;
};

export const operatorComparisonMap = new Map<string, string>([
  ["gt", ">"],
  ["ge", ">="],
  ["lt", "<"],
  ["le", "<="],
  ["eq", "="],
]);
