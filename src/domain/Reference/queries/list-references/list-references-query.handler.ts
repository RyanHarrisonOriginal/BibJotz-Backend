import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { Reference } from '@/domain/Reference/reference';
import { ReferenceMapper } from '@/domain/Reference/reference.mapper';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { ListReferencesQuery } from './list-references.query';

export class ListReferencesQueryHandler implements IQueryHandler<ListReferencesQuery, Reference[]> {
  constructor(private readonly referenceRepository: IReferenceRepository) {}

  async execute(query: ListReferencesQuery): Promise<Reference[]> {
    const rows = await this.referenceRepository.findMany({
      userId: query.userId,
      typeId: query.typeId,
    });
    return ReferenceMapper.mapReferencesToDomain(rows);
  }
}
