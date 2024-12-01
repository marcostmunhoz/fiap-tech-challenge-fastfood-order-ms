import { OrderRepository } from '@/order/domain/repository/order.repository.interface';
import { OrderRepositoryToken } from '@/order/tokens';
import {
  EntityIdValueObject,
  EntityNotFoundException,
  ItemQuantityValueObject,
  MoneyValueObject,
  OrderStatusEnum,
  UnauthorizedResourceException,
  UseCase,
  UserData,
} from '@marcostmunhoz/fastfood-libs';
import { Inject } from '@nestjs/common';

export type Input = {
  id: EntityIdValueObject;
  user: UserData;
};

export type Output = {
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

    if (order.customerId !== input.user.id) {
      throw new UnauthorizedResourceException();
    }

    return {
      items: order.items,
      total: order.total,
      status: order.status,
    };
  }
}
