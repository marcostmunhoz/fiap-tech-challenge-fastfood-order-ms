import { OrderFactory } from '@/order/domain/factory/order.factory';
import { OrderRepository } from '@/order/domain/repository/order.repository.interface';
import { OrderRepositoryToken } from '@/order/tokens';
import {
  EntityIdValueObject,
  UseCase,
  UserData,
} from '@marcostmunhoz/fastfood-libs';
import { Inject } from '@nestjs/common';

export type Input = UserData;

export type Output = {
  id: EntityIdValueObject;
};

export class CreateOrderUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
    private readonly orderFactory: OrderFactory,
  ) {}

  async execute(input: Input): Promise<Output> {
    const order = this.orderFactory.createOrder({
      customerId: input.id,
      customerName: input.name,
    });

    const { id } = await this.orderRepository.save(order);

    return { id };
  }
}
