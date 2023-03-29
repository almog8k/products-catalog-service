import z from "zod";
import { ConsumptionProtocol, ProductType } from "./product-enums";

export const PolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
});

export type Polygon = z.infer<typeof PolygonSchema>;
ProductType;

export const CreateProductSchema = z.object({
  name: z.string().max(48),
  description: z.string(),
  boundingPolygon: PolygonSchema,
  consumptionLink: z.string(),
  type: z.nativeEnum(ProductType),
  consumptionProtocol: z.nativeEnum(ConsumptionProtocol),
  resolutionBest: z.number(),
  minZoom: z.number(),
  maxZoom: z.number(),
});

export type CreateProductRequestBody = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial().strict();

export type UpdateProductRequestBody = z.infer<typeof UpdateProductSchema>;

const t: UpdateProductRequestBody = {};
export const ProductUUIDSchema = z.object({
  id: z.string().uuid(),
});

export type ProductRequestParams = z.infer<typeof ProductUUIDSchema>;

export type ProductOperationResponse = ProductRequestParams;

export const ProductRequestQuerySchema = z.object({
  filters: z.array(z.string()).or(z.string()).optional(),
});

export type ProductRequestQuery = z.infer<typeof ProductRequestQuerySchema>;

export const ProductSchema = CreateProductSchema.and(ProductUUIDSchema);

export type Product = z.infer<typeof ProductSchema>;
