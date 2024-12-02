import {
  FastfoodLibsModule,
  TypeOrmModuleOptionsToken,
} from '@marcostmunhoz/fastfood-libs';
import { FastfoodLibsModuleOptions } from '@marcostmunhoz/fastfood-libs/lib/fastfood-libs-options.type';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { OrderEntity } from './order/infrastructure/entity/order.entity';
import * as migrations from './order/infrastructure/migrations';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    FastfoodLibsModule.forRootAsync({
      imports: [],
      useFactory: () => {
        return {
          database: {
            migrations,
            migrationsTransactionMode: 'none',
            runMigrationsOnStartup: true,
          },
        } as FastfoodLibsModuleOptions;
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (options: TypeOrmModuleOptions) => {
        return {
          ...options,
          entities: [OrderEntity],
        };
      },
      inject: [TypeOrmModuleOptionsToken],
    }),
    TypeOrmModule.forFeature([OrderEntity]),
    HealthModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
