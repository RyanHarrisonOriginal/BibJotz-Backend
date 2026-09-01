import { ReferenceType } from '@/domain/Reference/reference-type';

export interface IReferenceTypeCreationProps {
  id: number | null;
  userId: number;
  name: string;
  normalizedName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ReferenceTypeFactory {
  static create(data: IReferenceTypeCreationProps): ReferenceType {
    return new ReferenceType(
      data.id,
      data.userId,
      data.name,
      data.normalizedName,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}
