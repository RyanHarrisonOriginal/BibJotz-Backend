import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';

export class GetCurrentUserQuery implements IQuery {
  readonly queryType = 'GetCurrentUserQuery';

  constructor(public readonly userId: number) {}

  static from(userId: number): GetCurrentUserQuery {
    if (!userId || Number.isNaN(userId) || userId < 1) throw new ValidationError('userId is required');
    return new GetCurrentUserQuery(userId);
  }
}
