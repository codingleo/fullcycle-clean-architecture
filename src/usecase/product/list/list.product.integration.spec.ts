import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUsecase from "../create/create.product.usecase";
import ListProductUsecase from "./list.product.usecase";

let sequelize: Sequelize;

describe("Integration test for product list use case", () => {
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list all products", async () => {
    const input1 = {
      name: "Saca Rolha",
      price: 1243.99
    }

    const input2 = {
      name: "Copo",
      price: 12.99
    }

    const productRepository = new ProductRepository()
    const productCreateUseCase = new CreateProductUsecase(productRepository)
    await productCreateUseCase.execute(input1)
    await productCreateUseCase.execute(input2)

    const productListUseCase = new ListProductUsecase(productRepository)
    const output = await productListUseCase.execute({})

    expect(output.products.length).toBe(2)
  });
})
