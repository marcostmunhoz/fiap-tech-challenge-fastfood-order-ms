import { ChangeOrderStatusUseCase } from '@/order/application/use-case/change-order-status.use-case';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
  UuidParam,
} from '@marcostmunhoz/fastfood-libs';
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { ChangeOrderStatusRequest } from '../dto/change-order-status.request';
import { OrderParam } from '../dto/order.param';

@ApiTags('Orders')
@Controller('orders')
export class ChangeOrderStatusController {
  constructor(
    @Inject(ChangeOrderStatusUseCase)
    private readonly useCase: ChangeOrderStatusUseCase,
  ) {}

  @Post(':id/change-status')
  @HttpCode(204)
  @ApiBearerAuth()
  @UuidParam({ name: 'id' })
  @ApiNoContentResponse()
  @DefaultBadRequestResponse()
  @DefaultNotFoundResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @Param() param: OrderParam,
    @Body() request: ChangeOrderStatusRequest,
  ): Promise<void> {
    await this.useCase.execute({
      id: param.id,
      status: request.status,
    });
  }
}
