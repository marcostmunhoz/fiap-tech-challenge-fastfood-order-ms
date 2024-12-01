import { OrderRepository } from '@/order/domain/repository/order.repository.interface';
import { ProductService } from '@/order/domain/service/product.service';
import { OrderRepositoryToken, ProductServiceToken } from '@/order/tokens';
import {
  EntityIdValueObject,
  EntityNotFoundException,
  ItemQuantityValueObject,
  OrderItemValueObject,
  ProductCodeValueObject,
  UnauthorizedResourceException,
  UseCase,
  UserData,
} from '@marcostmunhoz/fastfood-libs';
import { Inject } from '@nestjs/common';

export type Input = {
  id: EntityIdValueObject;
  user: UserData;
  data: {
    productCode: string;
    quantity: ItemQuantityValueObject;
  };
};

export type Output = void;

export class AddOrderItemUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
    @Inject(ProductServiceToken)
    private readonly productRepository: ProductService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      throw new EntityNotFoundException('Order not found with given ID.');
    }

    if (order.customerId !== input.user.id) {
      throw new UnauthorizedResourceException();
    }

    const product = await this.productRepository.findByCode(
      ProductCodeValueObject.create(input.data.productCode),
    );

    if (!product) {
      throw new EntityNotFoundException('Product not found with given code.');
    }

    const item = OrderItemValueObject.create({
      code: product.code.value,
      name: product.name.value,
      price: product.price,
      quantity: input.data.quantity,
    });

    order.addItem(item);

    await this.orderRepository.save(order);
  }
}
