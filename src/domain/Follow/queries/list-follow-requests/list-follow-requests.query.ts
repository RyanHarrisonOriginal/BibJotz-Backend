import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IListFollowRequestsQueryDTO } from '@/domain/Follow/follow.dto';

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export class ListFollowRequestsQuery implements IQuery {
  readonly queryType = 'ListFollowRequestsQuery';

  constructor(
    public readonly userId: number,
    public readonly limit: number,
    public readonly cursorCreatedAt: Date | undefined,
    public readonly cursorId: number | undefined,
  ) {}

  static from(dto: IListFollowRequestsQueryDTO): ListFollowRequestsQuery {
    const userId = parseInt(String(dto.userId ?? ''), 10);
    if (Number.isNaN(userId) || userId < 1) throw new ValidationError('userId is required');

    const rawLimit = first(dto.limit);
    const limit = rawLimit != null && rawLimit !== '' ? parseInt(String(rawLimit), 10) : 20;
    if (Number.isNaN(limit) || limit < 1) throw new ValidationError('limit must be a positive integer');

    const rawCreatedAt = first(dto.cursorCreatedAt);
    const rawId = first(dto.cursorId);
    const hasCreatedAt = rawCreatedAt != null && rawCreatedAt !== '';
    const hasId = rawId != null && rawId !== '';
    if (hasCreatedAt !== hasId) {
      throw new ValidationError('cursorCreatedAt and cursorId must be sent together');
    }

    let cursorCreatedAt: Date | undefined;
    let cursorId: number | undefined;
    if (hasCreatedAt && hasId) {
      cursorCreatedAt = new Date(String(rawCreatedAt));
      if (Number.isNaN(cursorCreatedAt.getTime())) {
        throw new ValidationError('cursorCreatedAt must be a datetime');
      }
      cursorId = parseInt(String(rawId), 10);
      if (Number.isNaN(cursorId) || cursorId < 1) throw new ValidationError('cursorId is required');
    }

    return new ListFollowRequestsQuery(userId, Math.min(limit, 50), cursorCreatedAt, cursorId);
  }
}
