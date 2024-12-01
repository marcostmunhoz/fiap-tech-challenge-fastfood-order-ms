import { OrderRepository } from '@/order/domain/repository/order.repository.interface';
import { OrderRepositoryToken } from '@/order/tokens';
import {
  EntityIdValueObject,
  EntityNotFoundException,
  ItemQuantityValueObject,
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

export class ChangeOrderItemQuantityUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      throw new EntityNotFoundException('Order not found with given ID.');
    }

    if (order.customerId !== input.user.id) {
      throw new UnauthorizedResourceException();
    }

    order.changeItemQuantity(input.data.productCode, input.data.quantity);

    await this.orderRepository.save(order);
  }
}
