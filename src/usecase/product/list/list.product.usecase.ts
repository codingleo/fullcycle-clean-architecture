import {InputListProductDto, OutputListProductDto,} from "./list.product.dto";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import ProductInterface from "../../../domain/product/entity/product.interface";

export default class ListProductUsecase {
  private productRepository: ProductRepositoryInterface;
  constructor(ProductRepository: ProductRepositoryInterface) {
    this.productRepository = ProductRepository;
  }

  async execute(input: InputListProductDto): Promise<OutputListProductDto> {
    const products = await this.productRepository.findAll();
    return OutputMapper.toOutput(products);
  }
}

class OutputMapper {
  static toOutput(products: ProductInterface[]): OutputListProductDto {
    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
      })),
    };
  }
}
