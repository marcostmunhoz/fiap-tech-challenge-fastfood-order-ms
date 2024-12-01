import { OrderEntity } from '../entity/order.entity';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { EntityIdValueObject } from '../value-object/entity-id.value-object';

export interface OrderRepository {
  findById(id: EntityIdValueObject): Promise<OrderEntity | null>;
  save(order: OrderEntity): Promise<OrderEntity>;
  listAscendingByCreatedAt(status: OrderStatusEnum): Promise<OrderEntity[]>;
}
