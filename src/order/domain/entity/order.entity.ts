import {
  AbstractEntity,
  ItemQuantityValueObject,
  MoneyValueObject,
  OrderData,
  OrderItemValueObject,
  OrderStatusEnum,
  PartialOrderData,
} from '@marcostmunhoz/fastfood-libs';
import { InvalidOrderStatusTransitionException } from '../exception/invalid-order-status-transition.exception';
import { ItemAlreadyAddedException } from '../exception/item-already-added.exception';
import { ItemNotFoundException } from '../exception/item-not-found.exception';
import { OrderCanNotBeEditedException } from '../exception/order-can-not-be-edited.exception';

export type PartialOrderEntityProps = Omit<
  PartialOrderData,
  'items' | 'total' | 'status'
>;

export type CompleteOrderEntityProps = OrderData;

export class OrderEntity extends AbstractEntity<CompleteOrderEntityProps> {
  public get customerId(): string {
    return this.props.customerId;
  }

  public get customerName(): string {
    return this.props.customerName;
  }

  public get items(): OrderItemValueObject[] {
    return this.props.items;
  }

  public get total(): MoneyValueObject {
    return this.props.total;
  }

  public get status(): OrderStatusEnum {
    return this.props.status;
  }

  public canBeEdited(): boolean {
    return this.status === OrderStatusEnum.PENDING;
  }

  public addItem(item: OrderItemValueObject): OrderEntity {
    this.ensureCanBeEdited();

    const exists = this.items.some(
      (existingItem) => existingItem.code === item.code,
    );

    if (exists) {
      throw new ItemAlreadyAddedException();
    }

    this.items.push(item);
    this.updateTotal();
    this.markAsUpdated();

    return this;
  }

  public removeItem(code: string): OrderEntity {
    this.ensureCanBeEdited();
    this.ensureItemExists(code);

    this.props.items = this.items.filter((item) => item.code !== code);
    this.updateTotal();
    this.markAsUpdated();

    return this;
  }

  public changeItemQuantity(
    code: string,
    quantity: ItemQuantityValueObject,
  ): OrderEntity {
    this.ensureCanBeEdited();
    this.ensureItemExists(code);

    this.props.items = this.items.map((item) => {
      if (item.code === code) {
        return OrderItemValueObject.create({
          code: item.code,
          name: item.name,
          price: item.price,
          quantity,
        });
      }

      return item;
    });
    this.updateTotal();
    this.markAsUpdated();

    return this;
  }

  public markAsPaid(): OrderEntity {
    if (OrderStatusEnum.PENDING !== this.status) {
      throw new InvalidOrderStatusTransitionException(
        this.status,
        OrderStatusEnum.PAID,
      );
    }

    this.props.status = OrderStatusEnum.PAID;
    this.markAsUpdated();

    return this;
  }

  public markAsPreparing(): OrderEntity {
    if (OrderStatusEnum.PAID !== this.status) {
      throw new InvalidOrderStatusTransitionException(
        this.status,
        OrderStatusEnum.PREPARING,
      );
    }

    this.props.status = OrderStatusEnum.PREPARING;
    this.markAsUpdated();

    return this;
  }

  public markAsReady(): OrderEntity {
    if (OrderStatusEnum.PREPARING !== this.status) {
      throw new InvalidOrderStatusTransitionException(
        this.status,
        OrderStatusEnum.READY,
      );
    }

    this.props.status = OrderStatusEnum.READY;
    this.markAsUpdated();

    return this;
  }

  public markAsDelivered(): OrderEntity {
    if (OrderStatusEnum.READY !== this.status) {
      throw new InvalidOrderStatusTransitionException(
        this.status,
        OrderStatusEnum.DELIVERED,
      );
    }

    this.props.status = OrderStatusEnum.DELIVERED;
    this.markAsUpdated();

    return this;
  }

  public markAsCanceled(): OrderEntity {
    if (OrderStatusEnum.PENDING !== this.status) {
      throw new InvalidOrderStatusTransitionException(
        this.status,
        OrderStatusEnum.CANCELED,
      );
    }

    this.props.status = OrderStatusEnum.CANCELED;
    this.markAsUpdated();

    return this;
  }

  private ensureItemExists(code: string): void {
    const exists = this.items.some((item) => item.code === code);

    if (!exists) {
      throw new ItemNotFoundException();
    }
  }

  private ensureCanBeEdited(): void {
    if (!this.canBeEdited()) {
      throw new OrderCanNotBeEditedException();
    }
  }

  private updateTotal(): void {
    const total = this.items.reduce(
      (carry: MoneyValueObject, item: OrderItemValueObject) =>
        carry.sum(item.total),
      MoneyValueObject.zero(),
    );

    this.props.total = total;
  }
}
