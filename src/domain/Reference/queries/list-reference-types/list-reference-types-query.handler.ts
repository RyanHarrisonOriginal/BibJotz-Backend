import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { DEFAULT_REFERENCE_TYPE_NAMES } from '@/domain/Reference/default-reference-types';
import { ReferenceType } from '@/domain/Reference/reference-type';
import { ReferenceTypeFactory } from '@/domain/Reference/reference-type-factory';
import { ReferenceTypeMapper } from '@/domain/Reference/reference-type.mapper';
import { IReferenceTypeRepository } from '@/domain/Reference/reference-type-repository.interface';
import { ListReferenceTypesQuery } from './list-reference-types.query';

export class ListReferenceTypesQueryHandler
  implements IQueryHandler<ListReferenceTypesQuery, ReferenceType[]>
{
  constructor(private readonly referenceTypeRepository: IReferenceTypeRepository) {}

  async execute(query: ListReferenceTypesQuery): Promise<ReferenceType[]> {
    await this.ensureDefaults(query.userId);
    const rows = await this.referenceTypeRepository.findManyByUserId(query.userId);
    return ReferenceTypeMapper.mapReferenceTypesToDomain(rows);
  }

  private async ensureDefaults(userId: number): Promise<void> {
    const existing = await this.referenceTypeRepository.findManyByUserId(userId);
    if (existing.length > 0) return;

    for (const name of DEFAULT_REFERENCE_TYPE_NAMES) {
      const parsed = ReferenceType.parseName(name);
      const type = ReferenceTypeFactory.create({
        id: null,
        userId,
        name: parsed.name,
        normalizedName: parsed.normalizedName,
      });
      await this.referenceTypeRepository.save(type);
    }
  }
}
