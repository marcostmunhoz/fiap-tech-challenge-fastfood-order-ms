import { CreateOrderUseCase } from '@/order/application/use-case/create-order.use-case';
import {
  AuthGuard,
  AuthUser,
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultUnprocessableEntityResponse,
  mapObjectToResponse,
  UserData,
} from '@marcostmunhoz/fastfood-libs';
import { Controller, HttpCode, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderResponse } from '../dto/create-order.response';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard)
export class CreateOrderController {
  constructor(
    @Inject(CreateOrderUseCase)
    private readonly useCase: CreateOrderUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CreateOrderResponse })
  @DefaultBadRequestResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(@AuthUser() user: UserData): Promise<CreateOrderResponse> {
    const result = await this.useCase.execute(user);

    return mapObjectToResponse(CreateOrderResponse, result);
  }
}
