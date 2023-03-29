import supertest from "supertest";

const reqHeaders = {
  "Content-Type": "application/json",
};
export class ProductRequestSender {
  constructor(public app: Express.Application) {}

  public async createProduct(
    body: Record<string, unknown>
  ): Promise<supertest.Response> {
    return supertest
      .agent(this.app)
      .post(`/products`)
      .set(reqHeaders)
      .send(body);
  }

  public async updateProduct(
    id: string,
    body: Record<string, unknown>
  ): Promise<supertest.Response> {
    return supertest
      .agent(this.app)
      .patch(`/products/${id}`)
      .set(reqHeaders)
      .send(body);
  }

  public async deleteProduct(id: string): Promise<supertest.Response> {
    return supertest.agent(this.app).delete(`/products/${id}`);
  }
  public async getProduct(id: string): Promise<supertest.Response> {
    return supertest.agent(this.app).get(`/products/${id}`);
  }

  public async getProducts(query?: string): Promise<supertest.Response> {
    if (query !== undefined) {
      return supertest.agent(this.app).get(`/products`).query(query);
    }
    return supertest.agent(this.app).get(`/products`);
  }
}
