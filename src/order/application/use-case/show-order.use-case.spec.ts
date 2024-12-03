import { OrderRepository } from '@/order/domain/repository/order.repository.interface';
import {
  getDomainOrderEntity,
  getOrderRepositoryMock,
} from '@/order/testing/helpers';
import {
  EntityNotFoundException,
  getValidOrderEntityId,
} from '@marcostmunhoz/fastfood-libs';
import { Output, ShowOrderUseCase } from './show-order.use-case';

describe('ShowOrderUseCase', () => {
  let sut: ShowOrderUseCase;
  let repository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    repository = getOrderRepositoryMock();
    sut = new ShowOrderUseCase(repository);
  });

  describe('execute', () => {
    it('should return an existing order', async () => {
      // Arrange
      const entity = getDomainOrderEntity();
      repository.findById.mockResolvedValue(entity);
      const output: Output = {
        id: entity.id,
        items: entity.items,
        total: entity.total,
        status: entity.status,
      };

      // Act
      const result = await sut.execute({ id: entity.id });

      // Assert
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(entity.id);
      expect(result).toEqual(output);
    });

    it('should throw an error when a order with the given id does not exists', async () => {
      // Arrange
      const id = getValidOrderEntityId();
      repository.findById.mockResolvedValue(null);

      // Act
      const result = sut.execute({ id });

      // Assert
      expect(result).rejects.toThrow(
        new EntityNotFoundException('Order not found with given ID.'),
      );
    });
  });
});
