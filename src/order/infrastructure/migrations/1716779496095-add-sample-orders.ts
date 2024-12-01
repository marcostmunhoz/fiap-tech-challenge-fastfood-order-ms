import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSampleOrders1716779496095 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    queryRunner.query(
      `INSERT INTO orders (id, customer_id, customer_name, items, total, status, created_at, updated_at) VALUES (
        '5105f5e7-514f-4726-bbbc-942c0aeb3d27',
        'edd93592-550c-4c01-9966-f91c60b9cca3',
        'John Doe',
        '[{"code": "PRD-001", "name": "X-Burger", "price": 1500, "quantity": 2}]',
        3000,
        'canceled',
        NOW(),
        NOW()
      ), (
        '20b63a4b-294a-4e48-b50e-29f5af483515',
        'edd93592-550c-4c01-9966-f91c60b9cca3',
        'John Doe',
        '[{"code": "PRD-001", "name": "X-Burger", "price": 1500, "quantity": 2}]',
        3000,
        'pending',
        NOW(),
        NOW()
      ), (
        'cc492101-9cd0-4713-9029-e9f6686df8f8',
        'edd93592-550c-4c01-9966-f91c60b9cca3',
        'John Doe',
        '[{"code": "PRD-002", "name": "X-Salada", "price": 1200, "quantity": 1}, {"code": "PRD-003", "name": "X-Bacon", "price": 1800, "quantity": 1}, {"code": "PRD-005", "name": "Barata Frita Pequena", "price": 500, "quantity": 1}]',
        3500,
        'paid',
        NOW(),
        NOW()
      ), (
        'ea9838af-693f-40df-8090-cf9dcb88d862',
        'c091b4b6-ed8f-4bef-b5da-e2981646a5cc',
        NULL,
        '[{"code": "PRD-004", "name": "X-Tudo", "price": 2000, "quantity": 1}, {"code": "PRD-010", "name": "Refrigerante 1L", "price": 800, "quantity": 1}]',
        2800,
        'paid',
        NOW(),
        NOW()
      ), (
        'ef4277da-bf4a-463d-a383-8047bf572fdc',
        'c091b4b6-ed8f-4bef-b5da-e2981646a5cc',
        NULL,
        '[{"code": "PRD-013", "name": "Milk shake 1L", "price": 2000, "quantity": 2}]',
        4000,
        'preparing',
        NOW(),
        NOW()
      ), (
        '87340722-135d-4ca2-ab5e-8eb7accd02e4',
        'c091b4b6-ed8f-4bef-b5da-e2981646a5cc',
        NULL,
        '[{"code": "PRD-001", "name": "X-Burger", "price": 1500, "quantity": 1}, {"code": "PRD-005", "name": "Batata Frita Pequena", "price": 500, "quantity": 1}, {"code": "PRD-008", "name": "Refrigerante 300ml", "price": 300, "quantity": 1}, {"code": "PRD-011", "name": "Milk shake 300ml", "price": 800, "quantity": 1}]',
        3100,
        'ready',
        NOW(),
        NOW()
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    queryRunner.query(`DELETE FROM orders`);
  }
}
