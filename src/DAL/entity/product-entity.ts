import { Geometry } from "geojson";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ConsumptionProtocol, ProductType } from "../../products/product-enums";

@Entity("product")
export class ProductEntity extends BaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 48 })
  name: string;

  @Column({ type: "varchar" })
  description: string;

  @Column({
    type: "geometry",
    spatialFeatureType: "Polygon",
    srid: 4326,
  })
  bounding_polygon: Geometry;

  @Column({ type: "varchar" })
  consumption_link: string;

  @Column({ type: "enum", enum: ProductType })
  type: string;

  @Column({ type: "enum", enum: ConsumptionProtocol })
  consumption_protocol: string;

  @Column({ type: "float" })
  resolution_best: number;

  @Column({
    type: "integer",
  })
  min_zoom: number;

  @Column({
    type: "integer",
  })
  max_zoom: number;

  @CreateDateColumn({ type: "timestamp with time zone" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updated_at: Date;
}
