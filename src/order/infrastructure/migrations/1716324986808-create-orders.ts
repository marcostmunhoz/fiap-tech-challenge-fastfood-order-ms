import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders1716324986808 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `CREATE TABLE orders (
        id VARCHAR(36) NOT NULL,
        customer_id VARCHAR(36) NOT NULL,
        customer_name VARCHAR(100) NULL,
        items JSON NOT NULL,
        total INT UNSIGNED NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        CONSTRAINT orders_pk_index PRIMARY KEY (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE orders`);
  }
}
