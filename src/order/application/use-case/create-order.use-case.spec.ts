import { OrderFactory } from '@/order/domain/factory/order.factory';
import { OrderRepository } from '@/order/domain/repository/order.repository.interface';
import {
  getDomainOrderEntity,
  getOrderFactoryMock,
  getOrderRepositoryMock,
} from '@/order/testing/helpers';
import { mockUser } from '@marcostmunhoz/fastfood-libs';
import { CreateOrderUseCase, Input } from './create-order.use-case';

describe('CreateOrderUseCase', () => {
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let orderFactoryMock: jest.Mocked<OrderFactory>;
  let sut: CreateOrderUseCase;

  beforeEach(() => {
    orderRepositoryMock = getOrderRepositoryMock();
    orderFactoryMock = getOrderFactoryMock();
    sut = new CreateOrderUseCase(orderRepositoryMock, orderFactoryMock);
  });

  describe('execute', () => {
    it('should create an order', async () => {
      // Arrange
      const input: Input = mockUser;
      const order = getDomainOrderEntity();
      orderFactoryMock.createOrder.mockReturnValueOnce(order);
      orderRepositoryMock.save.mockResolvedValueOnce(order);

      // Act
      const result = await sut.execute(input);

      // Assert
      expect(orderFactoryMock.createOrder).toHaveBeenCalledTimes(1);
      expect(orderFactoryMock.createOrder).toHaveBeenCalledWith({
        customerId: input.id,
        customerName: input.name,
      });
      expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      expect(result.id.equals(order.id)).toBe(true);
    });
  });
});
