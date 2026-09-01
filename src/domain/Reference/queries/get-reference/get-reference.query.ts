import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IGetReferenceParamsDTO } from '@/domain/Reference/reference.dto';

export class GetReferenceQuery implements IQuery {
  readonly queryType = 'GetReferenceQuery';

  constructor(public readonly id: number) {}

  static from(dto: IGetReferenceParamsDTO): GetReferenceQuery {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');
    return new GetReferenceQuery(id);
  }
}
