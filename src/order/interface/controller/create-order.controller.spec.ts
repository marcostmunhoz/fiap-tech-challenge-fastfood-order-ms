import {
  CreateOrderUseCase,
  Output,
} from '@/order/application/use-case/create-order.use-case';
import {
  AuthGuard,
  createMockGuard,
  getValidOrderEntityId,
  mockUser,
} from '@marcostmunhoz/fastfood-libs';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderController } from './create-order.controller';

describe('CreateOrderController', () => {
  let useCaseMock: jest.Mocked<CreateOrderUseCase>;
  let controller: CreateOrderController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateOrderUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateOrderUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [CreateOrderController],
    })
      .overrideGuard(AuthGuard)
      .useValue(createMockGuard())
      .compile();

    controller = module.get<CreateOrderController>(CreateOrderController);
  });

  describe('execute', () => {
    it('should return the created order', async () => {
      // Arrange
      const output: Output = {
        id: getValidOrderEntityId(),
      };
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      const response = await controller.execute(mockUser);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(response).toEqual({ id: output.id.value });
    });
  });
});
