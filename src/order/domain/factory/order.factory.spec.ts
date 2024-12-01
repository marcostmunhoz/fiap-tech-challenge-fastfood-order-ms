import {
  EntityIdGeneratorHelper,
  getEntityIdGeneratorHelperMock,
  getPartialOrderData,
  getValidOrderEntityId,
  MoneyValueObject,
  OrderStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { OrderEntity } from '../entity/order.entity';
import { OrderFactory } from './order.factory';

describe('OrderFactory', () => {
  let entityIdGeneratorMock: jest.Mocked<EntityIdGeneratorHelper>;
  let sut: OrderFactory;

  beforeEach(() => {
    entityIdGeneratorMock = getEntityIdGeneratorHelperMock();
    sut = new OrderFactory(entityIdGeneratorMock);
  });

  describe('createOrder', () => {
    it('should create an instance of the order entity', () => {
      // Arrange
      const props = getPartialOrderData();
      const id = getValidOrderEntityId();
      entityIdGeneratorMock.generate.mockReturnValue(id);
      const expectedDate = new Date();
      const dateSpy = jest
        .spyOn(global, 'Date')
        .mockImplementation(() => expectedDate);

      // Act
      const order = sut.createOrder(props);

      // Assert
      expect(entityIdGeneratorMock.generate).toHaveBeenCalledTimes(1);
      expect(dateSpy).toHaveBeenCalledTimes(2);
      expect(order).toBeInstanceOf(OrderEntity);
      expect(order.customerId).toEqual(props.customerId);
      expect(order.customerName).toEqual(props.customerName);
      expect(order.id).toEqual(id);
      expect(order.items).toEqual([]);
      expect(order.total.equals(MoneyValueObject.zero())).toBe(true);
      expect(order.status).toEqual(OrderStatusEnum.PENDING);
      expect(order.createdAt).toEqual(expectedDate);
      expect(order.updatedAt).toEqual(expectedDate);
    });
  });
});
