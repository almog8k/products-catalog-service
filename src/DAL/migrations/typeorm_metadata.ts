// src/DAL/migrations/1709123456789-CreateTypeORMMetadataTable.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTypeORMMetadataTable1709123456789
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "typeorm_metadata" (
                "type" varchar NOT NULL,
                "database" varchar,
                "schema" varchar,
                "table" varchar,
                "name" varchar,
                "value" text
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "typeorm_metadata"`);
  }
}
