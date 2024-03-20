import ProductFactory from "../../../domain/product/factory/product.factory";
import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUsecase from "../create/create.product.usecase";
import UpdateProductUsecase from "./update.product.usecase";


let sequelize: Sequelize;

describe("Integration test for product update use case", () => {
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

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUsecase(productRepository);
    const productUpdateUseCase = new UpdateProductUsecase(productRepository);

    const createInput = {
      name: "Saca Rolha",
      price: 124.99
    }


    const createOuput = await createProductUseCase.execute(createInput)

    const input = {
      id: createOuput.id,
      name: "Saca Rolha lalala",
      price: 12431414.99
    }

    const updateOuput = await productUpdateUseCase.execute(input);

    expect(updateOuput).toEqual(input);
  });
})
