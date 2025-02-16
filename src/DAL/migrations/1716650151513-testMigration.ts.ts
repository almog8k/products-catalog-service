import { MigrationInterface, QueryRunner } from "typeorm";

export class testMigration.ts1716650151513 implements MigrationInterface {
    name = 'testMigration.ts1716650151513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_category" DROP CONSTRAINT "sub_category_category_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "sub_category" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "sub_category" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "sub_category" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sub_category" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "sub_category" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sub_category" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "sub_category" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sub_category" ADD CONSTRAINT "UQ_4ec8c495300259f2322760a39fa" UNIQUE ("category_id")`);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" DROP CONSTRAINT "UQ_06835919888d1c1f3cad5ba1fe3"`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" ADD "currency" character varying(3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" ADD CONSTRAINT "UQ_06835919888d1c1f3cad5ba1fe3" UNIQUE ("currency")`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" ADD "rate" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sub_category" ADD CONSTRAINT "FK_4ec8c495300259f2322760a39fa" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_category" DROP CONSTRAINT "FK_4ec8c495300259f2322760a39fa"`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" ADD "rate" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" DROP CONSTRAINT "UQ_06835919888d1c1f3cad5ba1fe3"`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" ADD "currency" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" ADD CONSTRAINT "UQ_06835919888d1c1f3cad5ba1fe3" UNIQUE ("currency")`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "conversion_rates_usd" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "updated_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "created_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sub_category" DROP CONSTRAINT "UQ_4ec8c495300259f2322760a39fa"`);
        await queryRunner.query(`ALTER TABLE "sub_category" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "sub_category" ADD "updated_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sub_category" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "sub_category" ADD "created_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sub_category" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "sub_category" ADD "name" text`);
        await queryRunner.query(`ALTER TABLE "sub_category" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sub_category" ADD CONSTRAINT "sub_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
