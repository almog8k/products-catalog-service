import { MigrationInterface, QueryRunner } from "typeorm";

export class addApartemntTable1750543894528 implements MigrationInterface {
  name = "addApartemntTable1750543894528";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "apartments" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "model" character varying(10) NOT NULL, "building" character varying(10) NOT NULL, "plot" integer NOT NULL, "floor" integer NOT NULL, "apartment_num" integer NOT NULL, "rooms" integer NOT NULL, "area" numeric(8,2) NOT NULL, "balcony" numeric(8,2) NOT NULL, "storage" numeric(8,2) NOT NULL, "storage_num" integer NOT NULL, "parking_spots" integer NOT NULL, "price" numeric(12,2) NOT NULL, "blueprint_filename" character varying(255) NOT NULL, "blueprint_url" character varying(500), "blueprint_bucket_path" character varying(500) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'available', "is_active" boolean NOT NULL DEFAULT true, "notes" text, "estimated_rent_monthly" numeric(10,2), "apartment_score" numeric(5,2), "total_area" numeric(8,2), "price_per_sqm" numeric(10,2), "estimated_yield_annual" numeric(5,2), CONSTRAINT "PK_f6058e85d6d715dbe22b72fe722" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "apartments"`);
  }
}
