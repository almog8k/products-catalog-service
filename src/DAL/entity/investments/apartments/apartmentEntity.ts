import {
  Entity,
  Generated,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";
import { TimeRecordEntity } from "../../timeRecordEntity";

@Entity("apartments")
export class ApartmentEntity extends TimeRecordEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  @Generated("uuid")
  id: string;

  @Column({ type: "varchar", length: 10 })
  model: string;

  @Column({ type: "varchar", length: 10 })
  building: string;

  @Column({ type: "integer" })
  plot: number;

  @Column({ type: "integer" })
  floor: number;

  @Column({ name: "apartment_num", type: "integer" })
  apartmentNum: number;

  @Column({ type: "integer" })
  rooms: number;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  area: number;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  balcony: number;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  storage: number;

  @Column({ name: "storage_num", type: "integer" })
  storageNum: number;

  @Column({ name: "parking_spots", type: "integer" })
  parkingSpots: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  price: number;

  // File storage fields
  @Column({ name: "blueprint_filename", type: "varchar", length: 255 })
  blueprintFilename: string;

  @Column({
    name: "blueprint_url",
    type: "varchar",
    length: 500,
    nullable: true,
  })
  blueprintUrl?: string;

  @Column({ name: "blueprint_bucket_path", type: "varchar", length: 500 })
  blueprintBucketPath: string;

  // Status and metadata
  @Column({ type: "varchar", length: 20, default: "available" })
  status: "available" | "reserved" | "sold";

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive: boolean;

  // Additional fields
  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({
    name: "estimated_rent_monthly",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  estimatedRentMonthly: number;

  @Column({
    name: "apartment_score",
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
  })
  apartmentScore?: number; // 0-100 ranking/score

  // Computed fields (can be calculated on-the-fly or stored)
  @Column({
    name: "total_area",
    type: "decimal",
    precision: 8,
    scale: 2,
    nullable: true,
  })
  totalArea?: number; // area + balcony

  @Column({
    name: "price_per_sqm",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  pricePerSqm?: number; // price / area

  @Column({
    name: "estimated_yield_annual",
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
  })
  estimatedYieldAnnual?: number; // (rent * 12 / price) * 100
}
