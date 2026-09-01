import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { ICreateNoteRequestDTO } from '@/domain/Note/note.dto';

function parseVerseList(raw: number[] | string | null | undefined): number[] | null {
  if (raw == null || raw === '') return null;
  const values = Array.isArray(raw) ? raw : String(raw).split(',');
  const verses = values
    .map((value) => parseInt(String(value).trim(), 10))
    .filter((n) => !Number.isNaN(n) && n >= 1);
  return verses.length > 0 ? verses : null;
}

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
    public readonly verses: number[] | null,
    public readonly referenceIds: number[],
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
      parseVerseList(dto.verses),
      parseIdList(dto.referenceIds),
    );
  }
}

function parseIdList(raw: number[] | string | null | undefined): number[] {
  if (raw == null || raw === '') return [];
  const values = Array.isArray(raw) ? raw : String(raw).split(',');
  const ids = values
    .map((value) => parseInt(String(value).trim(), 10))
    .filter((n) => !Number.isNaN(n) && n >= 1);
  return [...new Set(ids)];
}
