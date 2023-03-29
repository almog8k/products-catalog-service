import { z } from "zod";
import {
  ConsumptionProtocol,
  ProductEnumFields,
  ProductFilterOperators,
  ProductGeoShapeFields,
  ProductGeoShapeFilterOperators,
  ProductNumberFields,
  ProductStringFields,
  ProductType,
} from "./product-enums";
import { PolygonSchema } from "./product-schema";

const ProductNumberFilterSchema = z.object({
  field: z.nativeEnum(ProductNumberFields),
  operator: z.nativeEnum(ProductFilterOperators),
  value: z.number(),
});

const ProductStringFilterSchema = z.object({
  field: z.nativeEnum(ProductStringFields),
  operator: z.literal(ProductFilterOperators.EQ),
  value: z.string(),
});

export const ProductGeoShapeFilterSchema = z.object({
  field: z.literal(ProductGeoShapeFields.BOUNDINGPOLYGON),
  operator: z.nativeEnum(ProductGeoShapeFilterOperators),
  value: PolygonSchema,
});

const ProductTypeFilterSchema = z.object({
  field: z.literal(ProductEnumFields.TYPE),
  operator: z.literal(ProductFilterOperators.EQ),
  value: z.nativeEnum(ProductType),
});

const ProductConsumptionProtocolFilterSchema = z.object({
  field: z.literal(ProductEnumFields.CONSUMPTIONPROTOCOL),
  operator: z.literal(ProductFilterOperators.EQ),
  value: z.nativeEnum(ConsumptionProtocol),
});

const ProductEnumFilterSchema = z.discriminatedUnion("field", [
  ProductTypeFilterSchema,
  ProductConsumptionProtocolFilterSchema,
]);

export const ProductFilterSchema = z
  .array(
    ProductNumberFilterSchema.or(ProductStringFilterSchema)
      .or(ProductEnumFilterSchema)
      .or(ProductGeoShapeFilterSchema)
  )
  .optional();

export type ProductFilters = z.infer<typeof ProductFilterSchema>;

export type ProductGeoShapeFilter = z.infer<typeof ProductGeoShapeFilterSchema>;
