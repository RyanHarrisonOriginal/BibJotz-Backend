import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IUntagNoteParamsDTO } from '@/domain/Note/note.dto';

export class UntagNoteCommand implements ICommand {
  readonly commandType = 'UntagNoteCommand';

  constructor(
    public readonly noteId: number,
    public readonly referenceId: number,
  ) {}

  static from(dto: IUntagNoteParamsDTO): UntagNoteCommand {
    const noteId = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(noteId) || noteId < 1) throw new ValidationError('id is required');
    const referenceId = parseInt(String(dto.referenceId ?? ''), 10);
    if (Number.isNaN(referenceId) || referenceId < 1) throw new ValidationError('referenceId is required');
    return new UntagNoteCommand(noteId, referenceId);
  }
}
