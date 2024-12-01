import { getDomainOrderEntity } from '@/order/testing/helpers';
import {
  getCompleteOrderData,
  getValidOrderItem,
  ItemQuantityValueObject,
  MoneyValueObject,
  OrderItemValueObject,
  OrderStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { InvalidOrderStatusTransitionException } from '../exception/invalid-order-status-transition.exception';
import { ItemAlreadyAddedException } from '../exception/item-already-added.exception';
import { ItemNotFoundException } from '../exception/item-not-found.exception';
import { OrderCanNotBeEditedException } from '../exception/order-can-not-be-edited.exception';

describe('OrderEntity', () => {
  describe('getters', () => {
    it('should return the correct values', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity(props);

      // Assert
      expect(order.customerId).toEqual(props.customerId);
      expect(order.customerName).toEqual(props.customerName);
      expect(order.items).toEqual(props.items);
      expect(order.total).toEqual(props.total);
      expect(order.status).toEqual(props.status);
      expect(order.createdAt).toEqual(props.createdAt);
      expect(order.updatedAt).toEqual(props.updatedAt);
    });
  });

  describe('canBeEdited', () => {
    it('should return a boolean indicating whether the order status is PENDING', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const pendingOrder = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PENDING,
      });
      const paidOrder = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PAID,
      });

      // Act
      const pendingOrderResult = pendingOrder.canBeEdited();
      const paidOrderResult = paidOrder.canBeEdited();

      // Assert
      expect(pendingOrderResult).toBe(true);
      expect(paidOrderResult).toBe(false);
    });
  });

  describe('addItem', () => {
    it('should add an item to the order and update its total', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        items: [],
        total: MoneyValueObject.zero(),
      });
      const item1 = OrderItemValueObject.create({
        code: 'product-code-1',
        name: 'Product 1',
        price: MoneyValueObject.create(100),
        quantity: ItemQuantityValueObject.create(1),
      });
      const item2 = OrderItemValueObject.create({
        code: 'product-code-2',
        name: 'Product 2',
        price: MoneyValueObject.create(200),
        quantity: ItemQuantityValueObject.create(2),
      });
      const markAsUpdatedSpy = jest.spyOn(order as any, 'markAsUpdated');

      // Act
      order.addItem(item1);
      order.addItem(item2);

      // Assert
      expect(markAsUpdatedSpy).toHaveBeenCalledTimes(2);
      expect(order.items).toHaveLength(2);
      expect(order.total.value).toEqual(500);
      expect(order.items[0].equals(item1)).toBe(true);
      expect(order.items[1].equals(item2)).toBe(true);
    });

    it('shoud throw an error if the order can not be edited', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PAID,
      });

      // Act
      const action = () => order.addItem(getValidOrderItem());

      // Assert
      expect(action).toThrow(OrderCanNotBeEditedException);
    });

    it('should throw an error if the item already exists in the order', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const item = getValidOrderItem();
      const order = getDomainOrderEntity({
        ...props,
        items: [item],
      });

      // Act
      const act = () => order.addItem(item);

      // Assert
      expect(act).toThrow(ItemAlreadyAddedException);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the order and update its total', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const item1 = OrderItemValueObject.create({
        code: 'product-code-1',
        name: 'Product 1',
        price: MoneyValueObject.create(100),
        quantity: ItemQuantityValueObject.create(1),
      });
      const item2 = OrderItemValueObject.create({
        code: 'product-code-2',
        name: 'Product 2',
        price: MoneyValueObject.create(200),
        quantity: ItemQuantityValueObject.create(2),
      });
      const order = getDomainOrderEntity({
        ...props,
        items: [item1, item2],
      });
      const markAsUpdatedSpy = jest.spyOn(order as any, 'markAsUpdated');

      // Act
      order.removeItem(item1.code);

      // Assert
      expect(markAsUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(order.items).toHaveLength(1);
      expect(order.total.value).toEqual(400);
      expect(order.items[0].equals(item2)).toBe(true);
    });

    it('shoud throw an error if the order can not be edited', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PAID,
      });

      // Act
      const act = () => order.removeItem('product-code');

      // Assert
      expect(act).toThrow(OrderCanNotBeEditedException);
    });

    it('should throw an error if the item does not exist in the order', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const item = getValidOrderItem();
      const order = getDomainOrderEntity({
        ...props,
        items: [],
      });

      // Act
      const action = () => order.removeItem(item.code);

      // Assert
      expect(action).toThrow(ItemNotFoundException);
    });
  });

  describe('changeItemQuantity', () => {
    it('should change the quantity of an item in the order and update its total', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const item1 = OrderItemValueObject.create({
        code: 'product-code-1',
        name: 'Product 1',
        price: MoneyValueObject.create(100),
        quantity: ItemQuantityValueObject.create(1),
      });
      const item2 = OrderItemValueObject.create({
        code: 'product-code-2',
        name: 'Product 2',
        price: MoneyValueObject.create(200),
        quantity: ItemQuantityValueObject.create(2),
      });
      const order = getDomainOrderEntity({
        ...props,
        items: [item1, item2],
      });
      const newQuantity = ItemQuantityValueObject.create(3);
      const markAsUpdatedSpy = jest.spyOn(order as any, 'markAsUpdated');

      // Act
      order.changeItemQuantity(item2.code, newQuantity);

      // Assert
      expect(markAsUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(order.items).toHaveLength(2);
      expect(order.total.value).toEqual(700);
      expect(order.items[1].quantity.equals(newQuantity)).toBe(true);
    });

    it('shoud throw an error if the order can not be edited', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PAID,
      });

      // Act
      const act = () =>
        order.changeItemQuantity(
          'product-code',
          ItemQuantityValueObject.create(1),
        );

      // Assert
      expect(act).toThrow(OrderCanNotBeEditedException);
    });

    it('should throw an error if the item does not exist in the order', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const item = getValidOrderItem();
      const order = getDomainOrderEntity({
        ...props,
        items: [],
      });

      // Act
      const action = () =>
        order.changeItemQuantity(item.code, ItemQuantityValueObject.create(1));

      // Assert
      expect(action).toThrow(ItemNotFoundException);
    });
  });

  describe('markAsPaid', () => {
    it('should mark the order as paid', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity(props);
      const orderSpy = jest.spyOn(order as any, 'markAsUpdated');

      // Act
      order.markAsPaid();

      // Assert
      expect(orderSpy).toHaveBeenCalledTimes(1);
      expect(order.status).toEqual(OrderStatusEnum.PAID);
    });

    it('should throw an exception if the order can not be marked as paid', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.CANCELED,
      });

      // Act
      const act = () => order.markAsPaid();

      // Assert
      expect(act).toThrow(
        new InvalidOrderStatusTransitionException(
          OrderStatusEnum.CANCELED,
          OrderStatusEnum.PAID,
        ),
      );
    });
  });

  describe('markAsPreparing', () => {
    it('should mark the order as preparing', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PAID,
      });
      const orderSpy = jest.spyOn(order as any, 'markAsUpdated');

      // Act
      order.markAsPreparing();

      // Assert
      expect(orderSpy).toHaveBeenCalledTimes(1);
      expect(order.status).toEqual(OrderStatusEnum.PREPARING);
    });

    it('should throw an exception if the order can not be marked as preparing', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PENDING,
      });

      // Act
      const act = () => order.markAsPreparing();

      // Assert
      expect(act).toThrow(
        new InvalidOrderStatusTransitionException(
          OrderStatusEnum.PENDING,
          OrderStatusEnum.PREPARING,
        ),
      );
    });
  });

  describe('markAsReady', () => {
    it('should mark the order as ready', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PREPARING,
      });
      const orderSpy = jest.spyOn(order as any, 'markAsUpdated');

      // Act
      order.markAsReady();

      // Assert
      expect(orderSpy).toHaveBeenCalledTimes(1);
      expect(order.status).toEqual(OrderStatusEnum.READY);
    });

    it('should throw an exception if the order can not be marked as ready', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PAID,
      });

      // Act
      const act = () => order.markAsReady();

      // Assert
      expect(act).toThrow(
        new InvalidOrderStatusTransitionException(
          OrderStatusEnum.PAID,
          OrderStatusEnum.READY,
        ),
      );
    });
  });

  describe('markAsDelivered', () => {
    it('should mark the order as delivered', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.READY,
      });
      const orderSpy = jest.spyOn(order as any, 'markAsUpdated');

      // Act
      order.markAsDelivered();

      // Assert
      expect(orderSpy).toHaveBeenCalledTimes(1);
      expect(order.status).toEqual(OrderStatusEnum.DELIVERED);
    });

    it('should throw an exception if the order can not be marked as delivered', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PREPARING,
      });

      // Act
      const act = () => order.markAsDelivered();

      // Assert
      expect(act).toThrow(
        new InvalidOrderStatusTransitionException(
          OrderStatusEnum.PREPARING,
          OrderStatusEnum.DELIVERED,
        ),
      );
    });
  });

  describe('markAsCanceled', () => {
    it('should mark the order as canceled', async () => {
      // Arrange
      const order = getDomainOrderEntity({
        status: OrderStatusEnum.PENDING,
      });
      const orderSpy = jest.spyOn(order as any, 'markAsUpdated');

      // Act
      order.markAsCanceled();

      // Assert
      expect(orderSpy).toHaveBeenCalledTimes(1);
      expect(order.status).toEqual(OrderStatusEnum.CANCELED);
    });

    it('should throw an exception if the order can not be marked as canceled', async () => {
      // Arrange
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.DELIVERED,
      });

      // Act
      const act = () => order.markAsCanceled();

      // Assert
      expect(act).toThrow(
        new InvalidOrderStatusTransitionException(
          OrderStatusEnum.DELIVERED,
          OrderStatusEnum.CANCELED,
        ),
      );
    });
  });
});
