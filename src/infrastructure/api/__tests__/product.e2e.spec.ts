import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Desodorante",
        price: 23.40
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Desodorante");
    expect(response.body.price).toBe(23.40);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Desodorante",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Desodorante",
        price: 23.40
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Parfum",
        price: 2344.40
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const product1 = listResponse.body.products[0];
    expect(product1.name).toBe("Desodorante");
    expect(product1.price).toBe(23.40);
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Parfum");
    expect(product2.price).toBe(2344.40);

    const listResponseXML = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Desodorante</name>`);
    expect(listResponseXML.text).toContain(`<price>23.4</price>`);
    expect(listResponseXML.text).toContain(`<name>Parfum</name>`);
    expect(listResponseXML.text).toContain(`<price>2344.4</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`</products>`);
  });
});
