import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomers1715900327981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE customers (
        id VARCHAR(36) NOT NULL,
        name VARCHAR(100) NULL,
        email VARCHAR(255) NULL,
        cpf VARCHAR(11) NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        CONSTRAINT customers_pk_index PRIMARY KEY (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE customers`);
  }
}
