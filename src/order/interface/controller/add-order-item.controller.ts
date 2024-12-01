import { AddOrderItemUseCase } from '@/order/application/use-case/add-order-item.use-case';
import {
  AuthGuard,
  AuthUser,
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
  UserData,
  UuidParam,
} from '@marcostmunhoz/fastfood-libs';
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { OrderItemRequest } from '../dto/order-item.request';
import { OrderParam } from '../dto/order.param';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard)
export class AddOrderItemController {
  constructor(
    @Inject(AddOrderItemUseCase)
    private readonly useCase: AddOrderItemUseCase,
  ) {}

  @Post(':id/add-item')
  @HttpCode(204)
  @ApiBearerAuth()
  @UuidParam({ name: 'id' })
  @ApiNoContentResponse()
  @DefaultBadRequestResponse()
  @DefaultNotFoundResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @AuthUser() user: UserData,
    @Param() param: OrderParam,
    @Body() request: OrderItemRequest,
  ): Promise<void> {
    await this.useCase.execute({
      id: param.id,
      data: request,
      user,
    });
  }
}
