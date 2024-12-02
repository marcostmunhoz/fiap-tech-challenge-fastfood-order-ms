import {
  EntityIdValueObject,
  OrderStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { OrderEntity } from '../entity/order.entity';

export interface OrderRepository {
  findById(id: EntityIdValueObject): Promise<OrderEntity | null>;
  save(order: OrderEntity): Promise<OrderEntity>;
  listAscendingByCreatedAt(status: OrderStatusEnum): Promise<OrderEntity[]>;
}
