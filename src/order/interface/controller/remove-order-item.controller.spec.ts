import { RemoveOrderItemUseCase } from '@/order/application/use-case/remove-order-item.use-case';
import {
  AuthGuard,
  createMockGuard,
  getValidOrderEntityId,
  mockUser,
} from '@marcostmunhoz/fastfood-libs';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderParam } from '../dto/order.param';
import { RemoveOrderItemRequest } from '../dto/remove-order-item.request';
import { RemoveOrderItemController } from './remove-order-item.controller';

describe('RemoveOrderItemController', () => {
  let useCaseMock: jest.Mocked<RemoveOrderItemUseCase>;
  let controller: RemoveOrderItemController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RemoveOrderItemUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RemoveOrderItemUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [RemoveOrderItemController],
    })
      .overrideGuard(AuthGuard)
      .useValue(createMockGuard())
      .compile();

    controller = module.get<RemoveOrderItemController>(
      RemoveOrderItemController,
    );
  });

  describe('execute', () => {
    it('should remove an item from the existing order', async () => {
      // Arrange
      const user = mockUser;
      const param: OrderParam = {
        id: getValidOrderEntityId(),
      };
      const request: RemoveOrderItemRequest = {
        productCode: 'product-code',
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
