import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IListFollowsQueryParamsDTO } from '@/domain/Follow/follow.dto';

export class ListFollowersQuery implements IQuery {
  readonly queryType = 'ListFollowersQuery';

  constructor(public readonly userId: number) {}

  static from(dto: IListFollowsQueryParamsDTO): ListFollowersQuery {
    const userId = parseInt(String(dto.userId ?? ''), 10);
    if (Number.isNaN(userId) || userId < 1) throw new ValidationError('userId is required');
    return new ListFollowersQuery(userId);
  }
}
