import {
  EntityIdGeneratorHelper,
  EntityIdGeneratorHelperToken,
  MoneyValueObject,
  OrderStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { Inject } from '@nestjs/common';
import { OrderEntity, PartialOrderEntityProps } from '../entity/order.entity';

export class OrderFactory {
  constructor(
    @Inject(EntityIdGeneratorHelperToken)
    private readonly entityIdGenerator: EntityIdGeneratorHelper,
  ) {}

  public createOrder(props: PartialOrderEntityProps): OrderEntity {
    return new OrderEntity({
      ...props,
      id: this.entityIdGenerator.generate(),
      items: [],
      total: MoneyValueObject.zero(),
      status: OrderStatusEnum.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
