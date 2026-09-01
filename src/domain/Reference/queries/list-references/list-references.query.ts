import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IListReferencesQueryParamsDTO } from '@/domain/Reference/reference.dto';

export class ListReferencesQuery implements IQuery {
  readonly queryType = 'ListReferencesQuery';

  constructor(
    public readonly userId: number,
    public readonly typeId: number | undefined,
  ) {}

  static from(dto: IListReferencesQueryParamsDTO): ListReferencesQuery {
    const userIdRaw = Array.isArray(dto.userId) ? dto.userId[0] : dto.userId;
    const userId = parseInt(String(userIdRaw ?? ''), 10);
    if (Number.isNaN(userId) || userId < 1) throw new ValidationError('userId is required');

    const typeRaw = Array.isArray(dto.typeId) ? dto.typeId[0] : dto.typeId;
    let typeId: number | undefined;
    if (typeRaw != null && typeRaw !== '') {
      typeId = parseInt(String(typeRaw), 10);
      if (Number.isNaN(typeId) || typeId < 1) throw new ValidationError('typeId must be a positive integer');
    }

    return new ListReferencesQuery(userId, typeId);
  }
}
