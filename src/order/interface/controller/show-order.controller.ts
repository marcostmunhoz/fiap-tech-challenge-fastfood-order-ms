import { ShowOrderUseCase } from '@/order/application/use-case/show-order.use-case';
import {
  AuthGuard,
  AuthUser,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  mapObjectToResponse,
  UserData,
  UuidParam,
} from '@marcostmunhoz/fastfood-libs';
import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrderParam } from '../dto/order.param';
import { OrderResponse } from '../dto/order.response';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard)
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
  async execute(
    @AuthUser() user: UserData,
    @Param() param: OrderParam,
  ): Promise<OrderResponse> {
    const result = await this.useCase.execute({ ...param, user });

    return mapObjectToResponse(OrderResponse, result);
  }
}
