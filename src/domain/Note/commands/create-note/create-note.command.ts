import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { ICreateNoteRequestDTO } from '@/domain/Note/note.dto';

export class CreateNoteCommand implements ICommand {
  readonly commandType = 'CreateNoteCommand';

  constructor(
    public readonly userId: number,
    public readonly content: string,
    public readonly bookName: string,
    public readonly bookShortName: string,
    public readonly chapter: number | null,
    public readonly startVerse: number | null,
    public readonly endVerse: number | null,
  ) {}

  static from(dto: ICreateNoteRequestDTO): CreateNoteCommand {
    const userId = Number(dto.userId);
    if (!userId || Number.isNaN(userId)) throw new ValidationError('userId is required');
    if (!dto.content?.trim()) throw new ValidationError('content is required');
    if (!dto.bookName?.trim()) throw new ValidationError('bookName is required');
    if (!dto.bookShortName?.trim()) throw new ValidationError('bookShortName is required');

    return new CreateNoteCommand(
      userId,
      dto.content.trim(),
      dto.bookName.trim(),
      dto.bookShortName.trim(),
      dto.chapter ?? null,
      dto.startVerse ?? null,
      dto.endVerse ?? null,
    );
  }
}
