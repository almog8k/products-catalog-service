export enum ProductType {
  RASTER = "RASTER",
  RASTERIZED_VECTOR = "RASTERIZED_VECTOR",
  _3DTILES = "3DTILES",
  QMESH = "QMESH",
}

export enum ConsumptionProtocol {
  WMS = "WMS",
  WMTS = "WMTS",
  XYZ = "XYZ",
  _3DTILES = "3DTILES",
}

export enum ProductNumberFields {
  RESOLUTIONBEST = "resolutionBest",
  MINZOOM = "minZoom",
  MAXZOOM = "maxZoom",
}
export enum ProductStringFields {
  NAME = "name",
  DESCRIPTION = "description",
  CONSUMPTIONLINK = "consumptionLink",
}

export enum ProductGeoShapeFields {
  BOUNDINGPOLYGON = "boundingPolygon",
}

export enum ProductEnumFields {
  TYPE = "type",
  CONSUMPTIONPROTOCOL = "consumptionProtocol",
}

export enum ProductFilterOperators {
  GT = "gt",
  GE = "ge",
  LT = "lt",
  LE = "le",
  EQ = "eq",
}

export enum ProductGeoShapeFilterOperators {
  CONTAINS = "contains",
  WITHIN = "within",
  INTERSECTS = "intersects",
}
