import {
  FastfoodLibsModule,
  TypeOrmModuleOptionsToken,
} from '@marcostmunhoz/fastfood-libs';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import * as migrations from './order/infrastructure/migrations';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    FastfoodLibsModule.forRootAsync({
      imports: [],
      useFactory: () => ({
        database: {
          type: 'mysql',
          migrations,
          migrationsTransactionMode: 'none',
          runMigrationsOnStartup: true,
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (options: TypeOrmModuleOptions) => {
        return {
          ...options,
          entities: [],
        };
      },
      inject: [TypeOrmModuleOptionsToken],
    }),
    TypeOrmModule.forFeature([]),
    HealthModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
