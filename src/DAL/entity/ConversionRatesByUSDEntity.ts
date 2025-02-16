import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Unique,
} from "typeorm";
import { TimeRecordEntity } from "./timeRecordEntity";

@Entity("conversion_rates_usd")
export class ConversionRatesUSDEntity extends TimeRecordEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "varchar", length: 3, unique: true })
  @Unique(["currency"])
  currency: string;

  @Column("float")
  rate: number;
}
