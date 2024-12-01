import { getCompleteOrderData, OrderData } from '@marcostmunhoz/fastfood-libs';
import {
  CompleteOrderEntityProps,
  OrderEntity as DomainOrderEntity,
} from '../domain/entity/order.entity';
import { OrderFactory } from '../domain/factory/order.factory';
import { OrderRepository } from '../domain/repository/order.repository.interface';
import { ProductService } from '../domain/service/product.service';
import { OrderEntity as InfrastructureOrderEntity } from '../infrastructure/entity/order.entity';

export const getDomainOrderEntity = (
  props: Partial<CompleteOrderEntityProps> = {},
): DomainOrderEntity => {
  const defaultProps = getCompleteOrderData();

  return new DomainOrderEntity({
    id: props.id || defaultProps.id,
    customerId: props.customerId || defaultProps.customerId,
    customerName: props.customerName || defaultProps.customerName,
    items: props.items || defaultProps.items,
    total: props.total || defaultProps.total,
    status: props.status || defaultProps.status,
    createdAt: props.createdAt || defaultProps.createdAt,
    updatedAt: props.updatedAt || defaultProps.updatedAt,
  });
};

export const getInfrastructureOrderEntity = (
  props: Partial<OrderData> = {},
): InfrastructureOrderEntity => {
  const defaultProps = getCompleteOrderData();
  const items = (props.items || defaultProps.items).map((item) => ({
    code: item.code,
    name: item.name,
    price: item.price.value,
    quantity: item.quantity.value,
  }));

  return {
    id: props.id?.value || defaultProps.id.value,
    customerId: props.customerId || defaultProps.customerId,
    customerName: props.customerName || defaultProps.customerName,
    items,
    total: props.total?.value || defaultProps.total.value,
    status: props.status || defaultProps.status,
    createdAt: props.createdAt || defaultProps.createdAt,
    updatedAt: props.updatedAt || defaultProps.updatedAt,
  };
};

export const getOrderFactoryMock = (): jest.Mocked<OrderFactory> =>
  ({
    createOrder: jest.fn(),
  }) as unknown as jest.Mocked<OrderFactory>;

export const getOrderRepositoryMock = (): jest.Mocked<OrderRepository> =>
  ({
    findById: jest.fn(),
    save: jest.fn(),
    listAscendingByCreatedAt: jest.fn(),
  }) as unknown as jest.Mocked<OrderRepository>;

export const getProductServiceMock = (): jest.Mocked<ProductService> =>
  ({
    findByCode: jest.fn(),
  }) as unknown as jest.Mocked<ProductService>;
