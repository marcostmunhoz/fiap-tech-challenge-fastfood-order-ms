import { ShowOrderUseCase } from '@/order/application/use-case/show-order.use-case';
import {
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  mapObjectToResponse,
  UuidParam,
} from '@marcostmunhoz/fastfood-libs';
import { Controller, Get, HttpCode, Inject, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrderParam } from '../dto/order.param';
import { OrderResponse } from '../dto/order.response';

@ApiTags('Orders')
@Controller('orders')
export class ShowOrderController {
  constructor(
    @Inject(ShowOrderUseCase)
    private readonly useCase: ShowOrderUseCase,
  ) {}

  @Get(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @UuidParam({ name: 'id' })
  @ApiOkResponse({ type: OrderResponse })
  @DefaultNotFoundResponse()
  @DefaultInternalServerErrorResponse()
  async execute(@Param() param: OrderParam): Promise<OrderResponse> {
    const result = await this.useCase.execute({ ...param });

    return mapObjectToResponse(OrderResponse, result);
  }
}
