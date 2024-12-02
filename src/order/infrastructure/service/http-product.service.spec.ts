import { getCompleteProductData } from '@marcostmunhoz/fastfood-libs';
import { HttpService } from '@nestjs/axios';
import { AxiosInstance } from 'axios';
import { OrderConfig } from '../config/order.config';
import { HttpProductService } from './http-product.service';

describe('HttpProductService', () => {
  let axios: jest.Mocked<AxiosInstance>;
  let httpClient: HttpService;
  let orderConfig: OrderConfig;
  let sut: HttpProductService;

  beforeEach(() => {
    axios = {
      get: jest.fn(),
    } as unknown as jest.Mocked<AxiosInstance>;
    httpClient = {
      axiosRef: axios,
    } as unknown as HttpService;
    orderConfig = {
      PRODUCT_SERVICE_URL: 'http://localhost:3000',
    };
    sut = new HttpProductService(orderConfig, httpClient);
  });

  describe('findByCode', () => {
    it('should call get in the underlying axios ref with correct url', async () => {
      // Arrange
      const data = getCompleteProductData();
      const { code } = data;
      axios.get.mockResolvedValue({
        data: {
          id: data.id.value,
          code: code.value,
          name: data.name.value,
          description: data.description.value,
          category: data.category,
          price: data.price.valueAsFloat,
          createdAt: data.createdAt.toISOString(),
          updatedAt: data.updatedAt.toISOString(),
        },
      });

      // Act
      const response = await sut.findByCode(code);

      // Assert
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:3000/api/v1/products/code/${code.value}`,
      );
      expect(response).toEqual(data);
    });
  });
});
