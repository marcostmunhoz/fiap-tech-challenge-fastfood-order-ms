import { OrderRepository } from '@/order/domain/repository/order.repository.interface';
import { OrderRepositoryToken } from '@/order/tokens';
import {
  EntityIdValueObject,
  EntityNotFoundException,
  OrderStatusEnum,
  UseCase,
} from '@marcostmunhoz/fastfood-libs';
import { Inject } from '@nestjs/common';

export type Input = {
  id: EntityIdValueObject;
  status: OrderStatusEnum.PAID | OrderStatusEnum.CANCELED;
};

export type Output = void;

export class ChangeOrderStatusUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      throw new EntityNotFoundException('Order not found with given ID.');
    }

    if (input.status === OrderStatusEnum.PAID) {
      order.markAsPaid();
    } else {
      order.markAsCanceled();
    }

    await this.orderRepository.save(order);
  }
}
