import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IGetUserParamsDTO } from '@/domain/User/user.dto';

export class GetUserQuery implements IQuery {
  readonly queryType = 'GetUserQuery';

  constructor(public readonly id: number) {}

  static from(dto: IGetUserParamsDTO): GetUserQuery {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');
    return new GetUserQuery(id);
  }
}
