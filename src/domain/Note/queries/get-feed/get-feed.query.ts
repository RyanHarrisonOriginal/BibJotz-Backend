import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IGetFeedQueryParamsDTO } from '@/domain/Note/note.dto';

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export class GetFeedQuery implements IQuery {
  readonly queryType = 'GetFeedQuery';

  constructor(
    public readonly userId: number,
    public readonly limit: number,
  ) {}

  static from(dto: IGetFeedQueryParamsDTO): GetFeedQuery {
    const userId = parseInt(String(first(dto.userId) ?? ''), 10);
    if (Number.isNaN(userId) || userId < 1) throw new ValidationError('userId is required');

    const rawLimit = first(dto.limit);
    const limit = rawLimit != null ? parseInt(String(rawLimit), 10) : 50;
    if (Number.isNaN(limit) || limit < 1) throw new ValidationError('limit must be a positive integer');

    return new GetFeedQuery(userId, Math.min(limit, 100));
  }
}
