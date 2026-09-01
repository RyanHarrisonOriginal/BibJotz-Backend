import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IListReferenceTypesQueryParamsDTO } from '@/domain/Reference/reference-type.dto';

export class ListReferenceTypesQuery implements IQuery {
  readonly queryType = 'ListReferenceTypesQuery';

  constructor(public readonly userId: number) {}

  static from(dto: IListReferenceTypesQueryParamsDTO): ListReferenceTypesQuery {
    const userIdRaw = Array.isArray(dto.userId) ? dto.userId[0] : dto.userId;
    const userId = parseInt(String(userIdRaw ?? ''), 10);
    if (Number.isNaN(userId) || userId < 1) throw new ValidationError('userId is required');
    return new ListReferenceTypesQuery(userId);
  }
}
