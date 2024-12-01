import { OrderRepository } from '@/order/domain/repository/order.repository.interface';
import { ProductService } from '@/order/domain/service/product.service';
import {
  getDomainOrderEntity,
  getOrderRepositoryMock,
  getProductServiceMock,
} from '@/order/testing/helpers';
import {
  getCompleteOrderData,
  getCompleteProductData,
  getValidOrderEntityId,
  ItemQuantityValueObject,
  mockUser,
  OrderItemValueObject,
} from '@marcostmunhoz/fastfood-libs';
import { AddOrderItemUseCase, Input } from './add-order-item.use-case';

describe('AddOrderItemUseCase', () => {
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let productServiceMock: jest.Mocked<ProductService>;
  let sut: AddOrderItemUseCase;

  beforeEach(() => {
    orderRepositoryMock = getOrderRepositoryMock();
    productServiceMock = getProductServiceMock();
    sut = new AddOrderItemUseCase(orderRepositoryMock, productServiceMock);
  });

  describe('execute', () => {
    it('should add an item to the order', async () => {
      // Arrange
      const orderProps = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...orderProps,
        items: [],
      });
      const product = getCompleteProductData();
      const input: Input = {
        id: order.id,
        user: mockUser,
        data: {
          productCode: product.code.value,
          quantity: ItemQuantityValueObject.create(2),
        },
      };
      orderRepositoryMock.findById.mockResolvedValue(order);
      productServiceMock.findByCode.mockResolvedValue(product);
      const orderSpy = jest.spyOn(order, 'addItem');

      // Act
      await sut.execute(input);

      // Assert
      expect(orderRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(order.id);
      expect(productServiceMock.findByCode).toHaveBeenCalledTimes(1);
      expect(productServiceMock.findByCode).toHaveBeenCalledWith(product.code);
      expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      expect(orderSpy).toHaveBeenCalledTimes(1);
      expect(orderSpy).toHaveBeenCalledWith(
        OrderItemValueObject.create({
          code: product.code.value,
          name: product.name.value,
          price: product.price,
          quantity: input.data.quantity,
        }),
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
      await expect(result).rejects.toThrow('Order not found with given ID.');
    });

    it('should throw an error if order belongs to another user', async () => {
      // Arrange
      const orderProps = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...orderProps,
        items: [],
        customerId: 'another-user-id',
      });
      const product = getCompleteProductData();
      const input: Input = {
        id: order.id,
        user: mockUser,
        data: {
          productCode: product.code.value,
          quantity: ItemQuantityValueObject.create(2),
        },
      };
      orderRepositoryMock.findById.mockResolvedValue(order);
      productServiceMock.findByCode.mockResolvedValue(product);

      // Act
      const result = sut.execute(input);

      // Assert
      await expect(result).rejects.toThrow('Unauthorized resource.');
    });

    it('should throw an error if product is not found', async () => {
      // Arrange
      const orderProps = getCompleteOrderData();
      const order = getDomainOrderEntity({
        ...orderProps,
        items: [],
      });
      const input: Input = {
        id: order.id,
        user: mockUser,
        data: {
          productCode: 'product-code',
          quantity: ItemQuantityValueObject.create(2),
        },
      };
      orderRepositoryMock.findById.mockResolvedValue(order);
      productServiceMock.findByCode.mockResolvedValue(null);

      // Act
      const result = sut.execute(input);

      // Assert
      await expect(result).rejects.toThrow(
        'Product not found with given code.',
      );
    });
  });
});
