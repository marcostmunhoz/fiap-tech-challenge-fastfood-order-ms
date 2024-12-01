import { Module } from '@nestjs/common';
import { AddOrderItemUseCase } from './application/use-case/add-order-item.use-case';
import { ChangeOrderItemQuantityUseCase } from './application/use-case/change-order-item-quantity.use-case';
import { CreateOrderUseCase } from './application/use-case/create-order.use-case';
import { RemoveOrderItemUseCase } from './application/use-case/remove-order-item.use-case';
import { ShowOrderUseCase } from './application/use-case/show-order.use-case';
import { TypeOrmOrderRepository } from './infrastructure/repository/type-orm-order.repository';
import { HttpProductService } from './infrastructure/service/http-product.service';
import { AddOrderItemController } from './interface/controller/add-order-item.controller';
import { ChangeOrderItemQuantityController } from './interface/controller/change-order-item-quantity.controller';
import { CreateOrderController } from './interface/controller/create-order.controller';
import { RemoveOrderItemController } from './interface/controller/remove-order-item.controller';
import { ShowOrderController } from './interface/controller/show-order.controller';
import { OrderRepositoryToken, ProductServiceToken } from './tokens';

const useCases = [
  CreateOrderUseCase,
  AddOrderItemUseCase,
  RemoveOrderItemUseCase,
  ChangeOrderItemQuantityUseCase,
  ShowOrderUseCase,
  {
    provide: ProductServiceToken,
    useClass: HttpProductService,
  },
  {
    provide: OrderRepositoryToken,
    useClass: TypeOrmOrderRepository,
  },
];

@Module({
  imports: [],
  providers: [...useCases],
  controllers: [
    CreateOrderController,
    AddOrderItemController,
    RemoveOrderItemController,
    ChangeOrderItemQuantityController,
    ShowOrderController,
  ],
})
export class OrderModule {}
