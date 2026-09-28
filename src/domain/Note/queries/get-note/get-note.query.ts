import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IGetNoteParamsDTO } from '@/domain/Note/note.dto';

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export class GetNoteQuery implements IQuery {
  readonly queryType = 'GetNoteQuery';

  constructor(
    public readonly id: number,
    public readonly viewerUserId: number,
  ) {}

  static from(dto: IGetNoteParamsDTO): GetNoteQuery {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');

    const viewerUserId = parseInt(String(first(dto.viewerUserId) ?? ''), 10);
    if (Number.isNaN(viewerUserId) || viewerUserId < 1) {
      throw new ValidationError('viewerUserId is required');
    }

    return new GetNoteQuery(id, viewerUserId);
  }
}
