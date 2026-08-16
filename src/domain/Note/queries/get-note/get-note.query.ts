import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IGetNoteParamsDTO } from '@/domain/Note/note.dto';

export class GetNoteQuery implements IQuery {
  readonly queryType = 'GetNoteQuery';

  constructor(public readonly id: number) {}

  static from(dto: IGetNoteParamsDTO): GetNoteQuery {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');
    return new GetNoteQuery(id);
  }
}
