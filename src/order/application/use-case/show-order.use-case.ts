import { OrderRepository } from '@/order/domain/repository/order.repository.interface';
import { OrderRepositoryToken } from '@/order/tokens';
import {
  EntityIdValueObject,
  EntityNotFoundException,
  ItemQuantityValueObject,
  MoneyValueObject,
  OrderStatusEnum,
  UseCase,
} from '@marcostmunhoz/fastfood-libs';
import { Inject } from '@nestjs/common';

export type Input = {
  id: EntityIdValueObject;
};

export type Output = {
  id: EntityIdValueObject;
  items: Array<{
    code: string;
    name: string;
    price: MoneyValueObject;
    quantity: ItemQuantityValueObject;
  }>;
  total: MoneyValueObject;
  status: OrderStatusEnum;
};

export class ShowOrderUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      throw new EntityNotFoundException('Order not found with given ID.');
    }

    return {
      id: order.id,
      items: order.items,
      total: order.total,
      status: order.status,
    };
  }
}
