import {
  ItemQuantityValueObject,
  TransformPrimitiveToValueObject,
} from '@marcostmunhoz/fastfood-libs';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderItemRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'PRD-001',
    type: String,
  })
  productCode: string;

  @IsNotEmpty()
  @IsNumber()
  @TransformPrimitiveToValueObject(ItemQuantityValueObject)
  @ApiProperty({
    example: 1,
    type: Number,
  })
  quantity: ItemQuantityValueObject;
}
