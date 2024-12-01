import { ChangeOrderItemQuantityUseCase } from '@/order/application/use-case/change-order-item-quantity.use-case';
import {
  AuthGuard,
  createMockGuard,
  getValidOrderEntityId,
  ItemQuantityValueObject,
  mockUser,
} from '@marcostmunhoz/fastfood-libs';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemRequest } from '../dto/order-item.request';
import { OrderParam } from '../dto/order.param';
import { ChangeOrderItemQuantityController } from './change-order-item-quantity.controller';

describe('ChangeOrderItemQuantityController', () => {
  let useCaseMock: jest.Mocked<ChangeOrderItemQuantityUseCase>;
  let controller: ChangeOrderItemQuantityController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ChangeOrderItemQuantityUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ChangeOrderItemQuantityUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [ChangeOrderItemQuantityController],
    })
      .overrideGuard(AuthGuard)
      .useValue(createMockGuard())
      .compile();

    controller = module.get<ChangeOrderItemQuantityController>(
      ChangeOrderItemQuantityController,
    );
  });

  describe('execute', () => {
    it('should change the quantity of an item on the existing order', async () => {
      // Arrange
      const user = mockUser;
      const param: OrderParam = {
        id: getValidOrderEntityId(),
      };
      const request: OrderItemRequest = {
        productCode: 'product-code',
        quantity: ItemQuantityValueObject.create(1),
      };

      // Act
      await controller.execute(mockUser, param, request);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith({
        id: param.id,
        data: request,
        user,
      });
    });
  });
});
