import { Reference } from '@/domain/Reference/reference';

export interface IReferenceListFilters {
  userId: number;
  typeId?: number;
}

export interface IReferenceRepository {
  save(reference: Reference): Promise<unknown>;
  findById(id: number): Promise<unknown | null>;
  findByUserTypeAndNormalizedTitle(
    userId: number,
    typeId: number,
    normalizedTitle: string,
  ): Promise<unknown | null>;
  findMany(filters: IReferenceListFilters): Promise<unknown[]>;
  deleteById(id: number): Promise<void>;
}
