import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveOrderItemRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'PRD-001',
    type: String,
  })
  productCode: string;
}
