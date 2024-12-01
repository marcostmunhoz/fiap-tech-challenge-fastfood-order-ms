import {
  ProductCodeValueObject,
  ProductData,
} from '@marcostmunhoz/fastfood-libs';

export interface ProductService {
  findByCode(code: ProductCodeValueObject): Promise<ProductData>;
}
