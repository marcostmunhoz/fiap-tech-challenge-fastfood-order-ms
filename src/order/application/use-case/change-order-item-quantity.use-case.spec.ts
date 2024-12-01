import { OrderRepository } from '@/order/domain/repository/order.repository.interface';
import {
  getDomainOrderEntity,
  getOrderRepositoryMock,
} from '@/order/testing/helpers';
import {
  getCompleteOrderData,
  getValidOrderEntityId,
  getValidOrderItem,
  ItemQuantityValueObject,
  mockUser,
} from '@marcostmunhoz/fastfood-libs';
import {
  ChangeOrderItemQuantityUseCase,
  Input,
} from './change-order-item-quantity.use-case';

describe('ChangeOrderItemQuantityUseCase', () => {
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let sut: ChangeOrderItemQuantityUseCase;

  beforeEach(() => {
    orderRepositoryMock = getOrderRepositoryMock();
    sut = new ChangeOrderItemQuantityUseCase(orderRepositoryMock);
  });

  describe('execute', () => {
    it('should change the quantity of an item from the order', async () => {
      // Arrange
      const item = getValidOrderItem();
      const props = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...props,
        items: [item],
      });
      const orderSpy = jest.spyOn(order, 'changeItemQuantity');
      const input: Input = {
        id: order.id,
        user: mockUser,
        data: {
          productCode: item.code,
          quantity: ItemQuantityValueObject.create(5),
        },
      };
      orderRepositoryMock.findById.mockResolvedValue(order);

      // Act
      await sut.execute(input);

      // Assert
      expect(orderRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(order.id);
      expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      expect(orderSpy).toHaveBeenCalledTimes(1);
      expect(orderSpy).toHaveBeenCalledWith(
        input.data.productCode,
        input.data.quantity,
      );
    });

    it('should throw an error if order is not found', async () => {
      // Arrange
      const input: Input = {
        id: getValidOrderEntityId(),
        user: mockUser,
        data: {
          productCode: 'product-code',
          quantity: ItemQuantityValueObject.create(2),
        },
      };
      orderRepositoryMock.findById.mockResolvedValue(null);

      // Act
      const result = sut.execute(input);

      // Assert
      await expect(result).rejects.toThrowError(
        'Order not found with given ID.',
      );
    });
  });

  it('should throw an error if order belongs to another user', async () => {
    // Arrange
    const order = getDomainOrderEntity({
      customerId: 'another-user-id',
    });
    const input: Input = {
      id: getValidOrderEntityId(),
      user: mockUser,
      data: {
        productCode: 'product-code',
        quantity: ItemQuantityValueObject.create(2),
      },
    };
    orderRepositoryMock.findById.mockResolvedValue(order);

    // Act
    const result = sut.execute(input);

    // Assert
    await expect(result).rejects.toThrow('Unauthorized resource.');
  });
});
