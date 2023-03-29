export const validProduct = {
  name: "test product",
  description: "test description",
  boundingPolygon: {
    type: "Polygon",
    coordinates: [
      [
        [0, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ],
  },
  consumptionLink: "consumtionLink",
  type: "RASTER",
  consumptionProtocol: "WMS",
  resolutionBest: 1,
  minZoom: 1,
  maxZoom: 3,
};

export const validFilterQuery =
  'filters={"field": "name", "operator": "eq", "value": "product-01"}';

export const validMultiFilterQuery =
  'filters={ "field": "name", "operator": "eq", "value": "product-01"}&filters={ "field": "resolutionBest", "operator": "gt", "value": 0 }';

export const invalidFilterQueryMissingFields = 'filters={"field": "name"}';

export const invalidFilterQueryWrongFields =
  'filters={ prop: "status", action: "gt", amount: 0 }';

export const invalidFilterQueryFieldNotExist =
  'filters={ field: "status", operator: "gt", value: 0 }';

export const invalidFilterQueryWrongFieldOperator =
  'filters={ field: "name", operator: "gt", value: "product" }';

export const invalidFilterQueryWrongFieldValue =
  'filters={ field: "resolutionBest", operator: "gt", value: "test product" }';
