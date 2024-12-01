import { ProductService } from '@/order/domain/service/product.service';
import {
  getCompleteProductData,
  ProductData,
} from '@marcostmunhoz/fastfood-libs';

export class HttpProductService implements ProductService {
  async findByCode(): Promise<ProductData> {
    // FIXME: Implement HTTP request to get product data
    return getCompleteProductData();
  }
}
