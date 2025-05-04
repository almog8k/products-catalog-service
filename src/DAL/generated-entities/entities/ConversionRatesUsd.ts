import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("conversion_rates_usd_currency_key", ["currency"], { unique: true })
@Index("conversion_rates_usd_id_key", ["id"], { unique: true })
@Index("conversion_rates_usd_pkey", ["id"], { unique: true })
@Entity("conversion_rates_usd", { schema: "public" })
export class ConversionRatesUsd {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("text", { name: "currency", unique: true })
  currency: string;

  @Column("double precision", { name: "rate", precision: 53 })
  rate: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "(now() AT TIME ZONE 'utc')",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "(now() AT TIME ZONE 'utc')",
  })
  updatedAt: Date;
}
