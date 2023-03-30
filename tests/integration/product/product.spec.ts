import { ProductRequestSender } from "./helpers/productRequestSender";
import { getApp } from "../../../src/app";
import { StatusCodes } from "http-status-codes";
import {
  ProductSchema,
  ProductUUIDSchema,
  UpdateProductRequestBody,
} from "../../../src/products/product-schema";
import { v4 } from "uuid";
import * as productMocks from "../../mocks/product-mocks";

let requestSender: ProductRequestSender;

beforeAll(() => {
  const app = getApp();
  requestSender = new ProductRequestSender(app);
});

describe("product", () => {
  describe("get product route", () => {
    describe("given the product does not exist", () => {
      const nonExistingId = v4();
      it("should return a 404", async () => {
        const getRes = await requestSender.getProduct(nonExistingId);
        expect(getRes.statusCode).toBe(StatusCodes.NOT_FOUND);
      });
    });

    describe("given the provided id is not valid", () => {
      const invalidId = "1a2b";
      it("should return a 400", async () => {
        const getRes = await requestSender.getProduct(invalidId);
        expect(getRes.statusCode).toBe(StatusCodes.BAD_REQUEST);
      });
    });

    describe("given the product does exist", () => {
      it("should return a 200 and the product", async () => {
        const createRes = await requestSender.createProduct(
          productMocks.validProduct
        );
        const existProductId = createRes.body.id;
        const getRes = await requestSender.getProduct(existProductId);
        const isValidResBody = ProductSchema.safeParse(getRes.body).success;
        expect(getRes.statusCode).toBe(StatusCodes.OK);
        expect(isValidResBody).toBe(true);
        expect(getRes.body.id).toBe(existProductId);
      });
    });
  });

  describe("create product route", () => {
    describe("given invalid product", () => {
      const invalidProduct = {};
      it("should return a 400", async () => {
        const createRes = await requestSender.createProduct(invalidProduct);
        expect(createRes.statusCode).toBe(StatusCodes.BAD_REQUEST);
      });
    });

    describe("given valid product", () => {
      it("should return a 201", async () => {
        const createRes = await requestSender.createProduct(
          productMocks.validProduct
        );
        const isValidResBody = ProductSchema.safeParse(createRes.body).success;
        expect(createRes.statusCode).toBe(StatusCodes.CREATED);
        expect(isValidResBody).toBe(true);
      });
    });
  });

  describe("update product route", () => {
    const invalidProductData = { status: "accepted" };
    const validProductData: UpdateProductRequestBody = {
      name: "new product name",
      minZoom: 2,
      maxZoom: 10,
    };
    describe("given invalid product data", () => {
      it("should return a 400", async () => {
        const createRes = await requestSender.createProduct(
          productMocks.validProduct
        );
        const existProductId = createRes.body.id;
        const updateRes = await requestSender.updateProduct(
          existProductId,
          invalidProductData
        );
        expect(updateRes.statusCode).toBe(StatusCodes.BAD_REQUEST);
      });
    });
    describe("given valid product data", () => {
      it("should return a 200", async () => {
        const createRes = await requestSender.createProduct(
          productMocks.validProduct
        );
        const existProductId = createRes.body.id;
        const updateRes = await requestSender.updateProduct(
          existProductId,
          validProductData
        );
        expect(updateRes.statusCode).toBe(StatusCodes.OK);
      });
    });
    describe("given valid data and non existing product id", () => {
      const nonExistingId = v4();
      it("should return a 404", async () => {
        const updateRes = await requestSender.updateProduct(
          nonExistingId,
          validProductData
        );
        expect(updateRes.statusCode).toBe(StatusCodes.NOT_FOUND);
      });
    });
    describe("given valid data and non valid product id", () => {
      const invalidId = "a1b2";
      it("should return a 400", async () => {
        const updateRes = await requestSender.updateProduct(
          invalidId,
          validProductData
        );
        expect(updateRes.statusCode).toBe(StatusCodes.BAD_REQUEST);
      });
    });
  });

  describe("delete product route", () => {
    describe("given valid product id", () => {
      it("should return a 204", async () => {
        const createRes = await requestSender.createProduct(
          productMocks.validProduct
        );
        const existProductId = createRes.body.id;
        const deleteRes = await requestSender.deleteProduct(existProductId);
        expect(deleteRes.statusCode).toBe(StatusCodes.NO_CONTENT);
      });
    });

    describe("given non existing product id", () => {
      const nonExistingId = v4();
      it("should return a 404", async () => {
        const deleteRes = await requestSender.deleteProduct(nonExistingId);
        expect(deleteRes.statusCode).toBe(StatusCodes.NOT_FOUND);
      });
    });

    describe("given invalid product id", () => {
      const invalidId = "a1b2";
      it("should return a 400", async () => {
        const deleteRes = await requestSender.deleteProduct(invalidId);
        expect(deleteRes.statusCode).toBe(StatusCodes.BAD_REQUEST);
      });
    });
  });

  describe("get products route", () => {
    describe("given valid product filter", () => {
      it("should return a 200", async () => {
        const getRes = await requestSender.getProducts(
          productMocks.validFilterQuery
        );
        expect(getRes.statusCode).toBe(StatusCodes.OK);
        expect(getRes.body.length).toBeGreaterThanOrEqual(0);
      });
    });

    describe("given valid product multi filter", () => {
      it("should return a 200", async () => {
        const getRes = await requestSender.getProducts(
          productMocks.validMultiFilterQuery
        );
        expect(getRes.statusCode).toBe(StatusCodes.OK);
        expect(getRes.body.length).toBeGreaterThanOrEqual(0);
      });
    });

    describe("without given filter query", () => {
      it("should return a 200", async () => {
        const getRes = await requestSender.getProducts();
        expect(getRes.statusCode).toBe(StatusCodes.OK);
        expect(getRes.body.length).toBeGreaterThanOrEqual(0);
      });
    });

    describe("given invalid product filters", () => {
      describe("filter field do not exist", () => {
        it("should return a 400", async () => {
          const invalidFilter = productMocks.invalidFilterQueryFieldNotExist;
          const getRes = await requestSender.getProducts(invalidFilter);
          expect(getRes.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });
      });

      describe("filter missing fields", () => {
        it("should return a 400", async () => {
          const invalidFilter = productMocks.invalidFilterQueryMissingFields;
          const getRes = await requestSender.getProducts(invalidFilter);
          expect(getRes.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });
      });

      describe("operator is not correlated with field", () => {
        it("should return a 400", async () => {
          const invalidFilter =
            productMocks.invalidFilterQueryWrongFieldOperator;
          const getRes = await requestSender.getProducts(invalidFilter);
          expect(getRes.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });
      });

      describe("value is not correlated with field", () => {
        it("should return a 400", async () => {
          const invalidFilter = productMocks.invalidFilterQueryWrongFieldValue;
          const getRes = await requestSender.getProducts(invalidFilter);
          expect(getRes.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });
      });

      describe("fields do not match filter fields", () => {
        it("should return a 400", async () => {
          const invalidFilter = productMocks.invalidFilterQueryWrongFields;
          const getRes = await requestSender.getProducts(invalidFilter);
          expect(getRes.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });
      });
    });
  });
});
