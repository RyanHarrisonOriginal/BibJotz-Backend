import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { ITagNoteRequestDTO } from '@/domain/Note/note.dto';

export class TagNoteCommand implements ICommand {
  readonly commandType = 'TagNoteCommand';

  constructor(
    public readonly noteId: number,
    public readonly referenceId: number,
  ) {}

  static from(dto: ITagNoteRequestDTO): TagNoteCommand {
    const noteId = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(noteId) || noteId < 1) throw new ValidationError('id is required');
    const referenceId = Number(dto.referenceId);
    if (!referenceId || Number.isNaN(referenceId)) throw new ValidationError('referenceId is required');
    return new TagNoteCommand(noteId, referenceId);
  }
}
