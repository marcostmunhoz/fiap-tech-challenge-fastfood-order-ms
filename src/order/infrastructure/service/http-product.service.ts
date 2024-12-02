import { ProductService } from '@/order/domain/service/product.service';
import {
  EntityIdValueObject,
  MoneyValueObject,
  ProductCategoryEnum,
  ProductCodeValueObject,
  ProductData,
  ProductDescriptionValueObject,
  ProductNameValueObject,
} from '@marcostmunhoz/fastfood-libs';
import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { ORDER_CONFIG_PROPS, OrderConfig } from '../config/order.config';

type HttpProductData = {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export class HttpProductService implements ProductService {
  constructor(
    @Inject(ORDER_CONFIG_PROPS.KEY)
    private readonly orderConfig: OrderConfig,
    private readonly httpClient: HttpService,
  ) {}

  async findByCode(code: ProductCodeValueObject): Promise<ProductData> {
    const { data } = await this.httpClient.axiosRef.get<HttpProductData>(
      `${this.orderConfig.PRODUCT_SERVICE_URL}/api/v1/products/code/${code.value}`,
    );

    return {
      id: EntityIdValueObject.create(data.id),
      code: ProductCodeValueObject.create(data.code),
      name: ProductNameValueObject.create(data.name),
      description: ProductDescriptionValueObject.create(data.description),
      category: data.category as ProductCategoryEnum,
      price: MoneyValueObject.createFromFloat(data.price),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}
