import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSampleCustomers1716779496094 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    queryRunner.query(
      `INSERT INTO customers (id, name, cpf, email, created_at, updated_at) VALUES (
        'edd93592-550c-4c01-9966-f91c60b9cca3',
        'John Doe',
        '66894662053',
        '66894662053@example.com',
        NOW(),
        NOW()
      ), (
        'c091b4b6-ed8f-4bef-b5da-e2981646a5cc',
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    queryRunner.query(`DELETE FROM customers`);
  }
}
