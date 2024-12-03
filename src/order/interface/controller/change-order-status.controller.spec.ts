import { ChangeOrderStatusUseCase } from '@/order/application/use-case/change-order-status.use-case';
import {
  AuthGuard,
  createMockGuard,
  getValidOrderEntityId,
  OrderStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { Test, TestingModule } from '@nestjs/testing';
import { ChangeOrderStatusRequest } from '../dto/change-order-status.request';
import { OrderParam } from '../dto/order.param';
import { ChangeOrderStatusController } from './change-order-status.controller';

describe('ChangeOrderStatusController', () => {
  let useCaseMock: jest.Mocked<ChangeOrderStatusUseCase>;
  let controller: ChangeOrderStatusController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ChangeOrderStatusUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ChangeOrderStatusUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [ChangeOrderStatusController],
    })
      .overrideGuard(AuthGuard)
      .useValue(createMockGuard())
      .compile();

    controller = module.get<ChangeOrderStatusController>(
      ChangeOrderStatusController,
    );
  });

  describe('execute', () => {
    it('should change the quantity of an item on the existing order', async () => {
      // Arrange
      const param: OrderParam = {
        id: getValidOrderEntityId(),
      };
      const request: ChangeOrderStatusRequest = {
        status: OrderStatusEnum.PAID,
      };

      // Act
      await controller.execute(param, request);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith({
        id: param.id,
        status: request.status,
      });
    });
  });
});
