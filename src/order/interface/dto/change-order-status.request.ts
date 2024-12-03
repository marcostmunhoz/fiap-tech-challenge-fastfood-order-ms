import { OrderStatusEnum } from '@marcostmunhoz/fastfood-libs';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class ChangeOrderStatusRequest {
  @IsNotEmpty()
  @IsString()
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum.PAID | OrderStatusEnum.CANCELED;
}
