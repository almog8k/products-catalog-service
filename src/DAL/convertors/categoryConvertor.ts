import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

function convertModelToEntity<T>(model: T): T {
  const entity = {} as T;

  for (const key in model) {
    if (Object.prototype.hasOwnProperty.call(model, key)) {
      const convertedKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      entity[convertedKey] = model[key];
    }
  }

  return entity;
}

// Example usage
interface Category {
  id: string;
  name: string;
  maxNumber: number;
}

@Entity()
class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ name: "max_number" })
  maxNumber: number;
}

const model: Category = { id: "id value", name: "name value", maxNumber: 5 };
const entity: CategoryEntity = convertModelToEntity<CategoryEntity>(model);
