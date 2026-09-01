import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { Reference } from '@/domain/Reference/reference';
import { ReferenceMapper } from '@/domain/Reference/reference.mapper';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { GetReferenceQuery } from './get-reference.query';

export class GetReferenceQueryHandler implements IQueryHandler<GetReferenceQuery, Reference> {
  constructor(private readonly referenceRepository: IReferenceRepository) {}

  async execute(query: GetReferenceQuery): Promise<Reference> {
    const row = await this.referenceRepository.findById(query.id);
    if (!row) throw new NotFoundError('Reference not found');
    return ReferenceMapper.mapReferenceToDomain(row);
  }
}
