import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddOrderItemUseCase } from './application/use-case/add-order-item.use-case';
import { ChangeOrderItemQuantityUseCase } from './application/use-case/change-order-item-quantity.use-case';
import { ChangeOrderStatusUseCase } from './application/use-case/change-order-status.use-case';
import { CreateOrderUseCase } from './application/use-case/create-order.use-case';
import { RemoveOrderItemUseCase } from './application/use-case/remove-order-item.use-case';
import { ShowOrderUseCase } from './application/use-case/show-order.use-case';
import { OrderFactory } from './domain/factory/order.factory';
import { ORDER_CONFIG_PROPS } from './infrastructure/config/order.config';
import { OrderEntity } from './infrastructure/entity/order.entity';
import { TypeOrmOrderRepository } from './infrastructure/repository/type-orm-order.repository';
import { HttpProductService } from './infrastructure/service/http-product.service';
import { AddOrderItemController } from './interface/controller/add-order-item.controller';
import { ChangeOrderItemQuantityController } from './interface/controller/change-order-item-quantity.controller';
import { ChangeOrderStatusController } from './interface/controller/change-order-status.controller';
import { CreateOrderController } from './interface/controller/create-order.controller';
import { RemoveOrderItemController } from './interface/controller/remove-order-item.controller';
import { ShowOrderController } from './interface/controller/show-order.controller';
import { OrderRepositoryToken, ProductServiceToken } from './tokens';

const useCases: Provider[] = [
  CreateOrderUseCase,
  AddOrderItemUseCase,
  RemoveOrderItemUseCase,
  ChangeOrderItemQuantityUseCase,
  ShowOrderUseCase,
  ChangeOrderStatusUseCase,
];
const factories = [OrderFactory];
const tokens: Provider[] = [
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
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    ConfigModule.forRoot({
      isGlobal: false,
      load: [ORDER_CONFIG_PROPS],
    }),
    HttpModule,
  ],
  providers: [...useCases, ...factories, ...tokens],
  controllers: [
    CreateOrderController,
    AddOrderItemController,
    RemoveOrderItemController,
    ChangeOrderItemQuantityController,
    ShowOrderController,
    ChangeOrderStatusController,
  ],
})
export class OrderModule {}
