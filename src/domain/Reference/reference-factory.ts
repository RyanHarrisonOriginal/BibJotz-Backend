import { Reference } from '@/domain/Reference/reference';

export interface IReferenceCreationProps {
  id: number | null;
  userId: number;
  typeId: number;
  typeName: string;
  title: string;
  normalizedTitle: string;
  author: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ReferenceFactory {
  static create(data: IReferenceCreationProps): Reference {
    return new Reference(
      data.id,
      data.userId,
      data.typeId,
      data.typeName,
      data.title,
      data.normalizedTitle,
      data.author,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}
