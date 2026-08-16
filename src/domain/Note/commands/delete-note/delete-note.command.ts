import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IDeleteNoteParamsDTO } from '@/domain/Note/note.dto';

export class DeleteNoteCommand implements ICommand {
  readonly commandType = 'DeleteNoteCommand';

  constructor(public readonly id: number) {}

  static from(dto: IDeleteNoteParamsDTO): DeleteNoteCommand {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');
    return new DeleteNoteCommand(id);
  }
}
