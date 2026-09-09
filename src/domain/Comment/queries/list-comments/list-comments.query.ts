import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IListCommentsQueryParamsDTO } from '@/domain/Comment/comment.dto';

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export class ListCommentsQuery implements IQuery {
  readonly queryType = 'ListCommentsQuery';

  constructor(
    public readonly noteId: number,
    public readonly viewerUserId: number | null,
  ) {}

  static from(dto: IListCommentsQueryParamsDTO): ListCommentsQuery {
    const noteId = parseInt(String(dto.noteId ?? ''), 10);
    if (Number.isNaN(noteId) || noteId < 1) throw new ValidationError('noteId is required');

    const viewerRaw = first(dto.viewerUserId);
    let viewerUserId: number | null = null;
    if (viewerRaw != null && viewerRaw !== '') {
      viewerUserId = parseInt(String(viewerRaw), 10);
      if (Number.isNaN(viewerUserId) || viewerUserId < 1) {
        throw new ValidationError('viewerUserId must be a positive integer');
      }
    }

    return new ListCommentsQuery(noteId, viewerUserId);
  }
}
