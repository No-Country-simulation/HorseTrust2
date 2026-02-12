import { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { AppDataSource } from "./data-source";


export async function getRepository<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): Promise<Repository<T>> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource.getRepository<T>(entity);
}