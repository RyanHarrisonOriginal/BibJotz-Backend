import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IUpdateNoteRequestDTO } from '@/domain/Note/note.dto';

export class UpdateNoteCommand implements ICommand {
  readonly commandType = 'UpdateNoteCommand';

  constructor(
    public readonly id: number,
    public readonly content: string | undefined,
    public readonly bookName: string | undefined,
    public readonly bookShortName: string | undefined,
    public readonly chapter: number | null | undefined,
    public readonly startVerse: number | null | undefined,
    public readonly endVerse: number | null | undefined,
  ) {}

  static from(dto: IUpdateNoteRequestDTO): UpdateNoteCommand {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');

    const hasContent = dto.content !== undefined;
    const hasReference =
      dto.bookName !== undefined ||
      dto.bookShortName !== undefined ||
      dto.chapter !== undefined ||
      dto.startVerse !== undefined ||
      dto.endVerse !== undefined;

    if (!hasContent && !hasReference) {
      throw new ValidationError('Provide content and/or a scripture reference to update');
    }

    return new UpdateNoteCommand(
      id,
      dto.content?.trim(),
      dto.bookName?.trim(),
      dto.bookShortName?.trim(),
      dto.chapter,
      dto.startVerse,
      dto.endVerse,
    );
  }
}
