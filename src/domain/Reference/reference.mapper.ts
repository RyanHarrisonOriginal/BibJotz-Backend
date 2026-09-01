import { Reference } from '@/domain/Reference/reference';
import { ReferenceFactory } from '@/domain/Reference/reference-factory';
import { IReferenceResponseDTO } from '@/domain/Reference/reference.dto';

type RawReference = {
  id: number;
  userId: number;
  typeId: number;
  title: string;
  normalizedTitle: string;
  author: string | null;
  createdAt: Date;
  updatedAt: Date;
  type?: { name?: string };
};

export class ReferenceMapper {
  static mapReferenceToPersistence(reference: Reference): Record<string, unknown> {
    return {
      id: reference.getId(),
      userId: reference.getUserId(),
      typeId: reference.getTypeId(),
      title: reference.getTitle(),
      normalizedTitle: reference.getNormalizedTitle(),
      author: reference.getAuthor(),
    };
  }

  static mapReferenceToDomain(raw: unknown): Reference {
    const row = raw as RawReference;
    return ReferenceFactory.create({
      id: row.id,
      userId: row.userId,
      typeId: row.typeId,
      typeName: row.type?.name ?? '',
      title: row.title,
      normalizedTitle: row.normalizedTitle,
      author: row.author,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static mapReferencesToDomain(raw: unknown[]): Reference[] {
    return raw.map((row) => ReferenceMapper.mapReferenceToDomain(row));
  }

  static mapReferenceToResponseDTO(reference: Reference): IReferenceResponseDTO {
    return {
      id: reference.getId() ?? 0,
      userId: reference.getUserId(),
      typeId: reference.getTypeId(),
      typeName: reference.getTypeName(),
      title: reference.getTitle(),
      author: reference.getAuthor(),
      createdAt: reference.getCreatedAt().toISOString(),
      updatedAt: reference.getUpdatedAt().toISOString(),
    };
  }

  static mapReferencesToResponseDTO(references: Reference[]): IReferenceResponseDTO[] {
    return references.map((reference) => ReferenceMapper.mapReferenceToResponseDTO(reference));
  }
}
