import { BaseEntity } from '@marcostmunhoz/fastfood-libs';
import { Column, Entity } from 'typeorm';

export type OrderItemProps = {
  code: string;
  name: string;
  quantity: number;
  price: number;
};

@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'customer_name', nullable: true })
  customerName?: string;

  @Column({ type: 'json' })
  items: OrderItemProps[];

  @Column()
  total: number;

  @Column()
  status: string;
}
