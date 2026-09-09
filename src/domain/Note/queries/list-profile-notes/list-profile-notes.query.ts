import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IListProfileNotesQueryParamsDTO } from '@/domain/Note/note.dto';

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export class ListProfileNotesQuery implements IQuery {
  readonly queryType = 'ListProfileNotesQuery';

  constructor(public readonly userId: number) {}

  static from(dto: IListProfileNotesQueryParamsDTO): ListProfileNotesQuery {
    const userId = parseInt(String(first(dto.userId) ?? ''), 10);
    if (Number.isNaN(userId) || userId < 1) throw new ValidationError('userId is required');
    return new ListProfileNotesQuery(userId);
  }
}
