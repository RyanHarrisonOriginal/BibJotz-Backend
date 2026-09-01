import { ReferenceType } from '@/domain/Reference/reference-type';
import { ReferenceTypeFactory } from '@/domain/Reference/reference-type-factory';
import { IReferenceTypeResponseDTO } from '@/domain/Reference/reference-type.dto';

type RawReferenceType = {
  id: number;
  userId: number;
  name: string;
  normalizedName: string;
  createdAt: Date;
  updatedAt: Date;
};

export class ReferenceTypeMapper {
  static mapReferenceTypeToPersistence(type: ReferenceType): Record<string, unknown> {
    return {
      id: type.getId(),
      userId: type.getUserId(),
      name: type.getName(),
      normalizedName: type.getNormalizedName(),
    };
  }

  static mapReferenceTypeToDomain(raw: unknown): ReferenceType {
    const row = raw as RawReferenceType;
    return ReferenceTypeFactory.create({
      id: row.id,
      userId: row.userId,
      name: row.name,
      normalizedName: row.normalizedName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static mapReferenceTypesToDomain(raw: unknown[]): ReferenceType[] {
    return raw.map((row) => ReferenceTypeMapper.mapReferenceTypeToDomain(row));
  }

  static mapReferenceTypeToResponseDTO(type: ReferenceType): IReferenceTypeResponseDTO {
    return {
      id: type.getId() ?? 0,
      userId: type.getUserId(),
      name: type.getName(),
      createdAt: type.getCreatedAt().toISOString(),
      updatedAt: type.getUpdatedAt().toISOString(),
    };
  }

  static mapReferenceTypesToResponseDTO(types: ReferenceType[]): IReferenceTypeResponseDTO[] {
    return types.map((type) => ReferenceTypeMapper.mapReferenceTypeToResponseDTO(type));
  }
}
