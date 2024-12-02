import { validateConfig } from '@marcostmunhoz/fastfood-libs';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrderConfig {
  @IsString()
  @IsNotEmpty()
  PRODUCT_SERVICE_URL: string;
}

export const ORDER_CONFIG_PROPS = registerAs('order', () => {
  const props = {
    PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL,
  };

  return validateConfig(OrderConfig, props);
});
