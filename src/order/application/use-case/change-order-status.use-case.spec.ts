import { OrderRepository } from '@/order/domain/repository/order.repository.interface';
import {
  getDomainOrderEntity,
  getOrderRepositoryMock,
} from '@/order/testing/helpers';
import {
  EntityNotFoundException,
  getValidOrderEntityId,
  OrderStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import {
  ChangeOrderStatusUseCase,
  Input,
} from './change-order-status.use-case';

describe('ChangeOrderStatusUseCase', () => {
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let sut: ChangeOrderStatusUseCase;

  beforeEach(() => {
    orderRepositoryMock = getOrderRepositoryMock();
    sut = new ChangeOrderStatusUseCase(orderRepositoryMock);
  });

  describe('execute', () => {
    it('should call markAsPaid when given status is paid', async () => {
      // Arrange
      const order = getDomainOrderEntity();
      const orderSpy = jest.spyOn(order, 'markAsPaid');
      const input: Input = {
        id: order.id,
        status: OrderStatusEnum.PAID,
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
    });

    it('should call markAsCanceled when given status is paid', async () => {
      // Arrange
      const order = getDomainOrderEntity();
      const orderSpy = jest.spyOn(order, 'markAsCanceled');
      const input: Input = {
        id: order.id,
        status: OrderStatusEnum.CANCELED,
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
    });

    it('should throw an error if order does not exists', async () => {
      // Arrange
      const input: Input = {
        id: getValidOrderEntityId(),
        status: OrderStatusEnum.PAID,
      };
      orderRepositoryMock.findById.mockResolvedValue(null);

      // Act
      const result = sut.execute(input);

      // Assert
      await expect(result).rejects.toThrow(
        new EntityNotFoundException('Order not found with given ID.'),
      );
    });
  });
});
