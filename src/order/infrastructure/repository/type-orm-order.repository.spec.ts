import { OrderEntity as DomainOrderEntity } from '@/order/domain/entity/order.entity';
import {
  getDomainOrderEntity,
  getInfrastructureOrderEntity,
} from '@/order/testing/helpers';
import {
  EntityIdValueObject,
  getTypeOrmRepositoryMock,
  getValidOrderEntityId,
  OrderStatusEnum,
} from '@marcostmunhoz/fastfood-libs';
import { Repository } from 'typeorm';
import { OrderEntity as InfrastructureOrderEntity } from '../entity/order.entity';
import { TypeOrmOrderRepository } from './type-orm-order.repository';

describe('TypeOrmOrderRepository', () => {
  let repositoryMock: jest.Mocked<Repository<InfrastructureOrderEntity>>;
  let sut: TypeOrmOrderRepository;

  beforeEach(() => {
    const mocks = getTypeOrmRepositoryMock<InfrastructureOrderEntity>();
    repositoryMock = mocks.repositoryMock as unknown as jest.Mocked<
      Repository<InfrastructureOrderEntity>
    >;
    sut = new TypeOrmOrderRepository(repositoryMock);
  });

  describe('findById', () => {
    it('should return an order entity when a order with the provided ID exists', async () => {
      // Arrange
      const dbEntity = getInfrastructureOrderEntity();
      repositoryMock.findOneBy.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.findById(
        EntityIdValueObject.create(dbEntity.id),
      );

      // Assert
      expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
        id: dbEntity.id,
      });
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainOrderEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.customerId).toBe(dbEntity.customerId);
      expect(result.customerName).toBe(dbEntity.customerName);
      expect(result.items).toHaveLength(dbEntity.items.length);
      expect(result.items[0].code).toBe(dbEntity.items[0].code);
      expect(result.items[0].name).toBe(dbEntity.items[0].name);
      expect(result.items[0].price.value).toBe(dbEntity.items[0].price);
      expect(result.items[0].quantity.value).toBe(dbEntity.items[0].quantity);
      expect(result.total.value).toBe(dbEntity.total);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });

    it('should return null when no order with the provided ID exists', async () => {
      // Arrange
      const id = getValidOrderEntityId();
      repositoryMock.findOneBy.mockResolvedValue(null);

      // Act
      const result = await sut.findById(id);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should create an order', async () => {
      // Arrange
      const entity = getDomainOrderEntity();
      const dbEntity = getInfrastructureOrderEntity(entity);
      repositoryMock.save.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.save(entity);

      // Assert
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledWith(dbEntity);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainOrderEntity);
      expect(result.id.value).toBe(entity.id.value);
      expect(result.customerId).toBe(entity.customerId);
      expect(result.customerName).toBe(entity.customerName);
      expect(result.items).toHaveLength(entity.items.length);
      expect(result.items[0].code).toBe(entity.items[0].code);
      expect(result.items[0].name).toBe(entity.items[0].name);
      expect(result.items[0].price.value).toBe(entity.items[0].price.value);
      expect(result.items[0].quantity.value).toBe(
        entity.items[0].quantity.value,
      );
      expect(result.total.value).toBe(entity.total.value);
      expect(result.createdAt).toEqual(entity.createdAt);
      expect(result.updatedAt).toEqual(entity.updatedAt);
    });
  });

  describe('listAscendingByCreatedAt', () => {
    it('should return a list of orders ordered by updatedAt', async () => {
      // Arrange
      const dbEntities = [
        getInfrastructureOrderEntity({
          id: EntityIdValueObject.create('order-id-2'),
        }),
        getInfrastructureOrderEntity({
          id: EntityIdValueObject.create('order-id-1'),
        }),
      ];
      repositoryMock.find.mockResolvedValue(dbEntities);

      // Act
      const result = await sut.listAscendingByCreatedAt(OrderStatusEnum.PAID);

      // Assert
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: { status: OrderStatusEnum.PAID },
        order: { createdAt: 'ASC' },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(DomainOrderEntity);
      expect(result[0].id.value).toBe(dbEntities[0].id);
      expect(result[1]).toBeInstanceOf(DomainOrderEntity);
      expect(result[1].id.value).toBe(dbEntities[1].id);
    });
  });
});
