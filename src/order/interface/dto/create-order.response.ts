import {
  TransformValueObjectToPrimitive,
  UuidProperty,
} from '@marcostmunhoz/fastfood-libs';
import { Expose } from 'class-transformer';

export class CreateOrderResponse {
  @Expose()
  @TransformValueObjectToPrimitive()
  @UuidProperty()
  id: string;
}
