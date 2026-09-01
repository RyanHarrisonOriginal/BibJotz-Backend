import { ReferenceType } from '@/domain/Reference/reference-type';

export interface IReferenceTypeRepository {
  save(type: ReferenceType): Promise<unknown>;
  findById(id: number): Promise<unknown | null>;
  findByUserIdAndNormalizedName(userId: number, normalizedName: string): Promise<unknown | null>;
  findManyByUserId(userId: number): Promise<unknown[]>;
  countReferences(typeId: number): Promise<number>;
  deleteById(id: number): Promise<void>;
}
