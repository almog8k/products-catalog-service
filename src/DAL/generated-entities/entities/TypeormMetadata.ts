import { Column, Entity } from "typeorm";

@Entity("typeorm_metadata", { schema: "public" })
export class TypeormMetadata {
  @Column("character varying", { name: "type" })
  type: string;

  @Column("character varying", { name: "database", nullable: true })
  database: string | null;

  @Column("character varying", { name: "schema", nullable: true })
  schema: string | null;

  @Column("character varying", { name: "table", nullable: true })
  table: string | null;

  @Column("character varying", { name: "name", nullable: true })
  name: string | null;

  @Column("text", { name: "value", nullable: true })
  value: string | null;
}
