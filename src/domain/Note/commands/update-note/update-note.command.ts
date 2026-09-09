import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IUpdateNoteRequestDTO } from '@/domain/Note/note.dto';
import { parseActorUserId } from '@/domain/shared/assert-owner';

function parseVerseList(raw: number[] | string | null | undefined): number[] | null | undefined {
  if (raw === undefined) return undefined;
  if (raw == null || raw === '') return null;
  const values = Array.isArray(raw) ? raw : String(raw).split(',');
  const verses = values
    .map((value) => parseInt(String(value).trim(), 10))
    .filter((n) => !Number.isNaN(n) && n >= 1);
  return verses.length > 0 ? verses : null;
}

function parseOptionalBool(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  throw new ValidationError('Visibility flags must be boolean');
}

export class UpdateNoteCommand implements ICommand {
  readonly commandType = 'UpdateNoteCommand';

  constructor(
    public readonly id: number,
    public readonly actorUserId: number,
    public readonly content: string | undefined,
    public readonly bookName: string | undefined,
    public readonly bookShortName: string | undefined,
    public readonly chapter: number | null | undefined,
    public readonly startVerse: number | null | undefined,
    public readonly endVerse: number | null | undefined,
    public readonly verses: number[] | null | undefined,
    public readonly isProfileVisible: boolean | undefined,
    public readonly isFeedShared: boolean | undefined,
  ) {}

  static from(dto: IUpdateNoteRequestDTO): UpdateNoteCommand {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');
    const actorUserId = parseActorUserId(dto.actorUserId);

    const hasContent = dto.content !== undefined;
    const hasReference =
      dto.bookName !== undefined ||
      dto.bookShortName !== undefined ||
      dto.chapter !== undefined ||
      dto.startVerse !== undefined ||
      dto.endVerse !== undefined ||
      dto.verses !== undefined;
    const hasVisibility = dto.isProfileVisible !== undefined || dto.isFeedShared !== undefined;

    if (!hasContent && !hasReference && !hasVisibility) {
      throw new ValidationError('Provide content, scripture reference, and/or visibility flags to update');
    }

    return new UpdateNoteCommand(
      id,
      actorUserId,
      dto.content?.trim(),
      dto.bookName?.trim(),
      dto.bookShortName?.trim(),
      dto.chapter,
      dto.startVerse,
      dto.endVerse,
      parseVerseList(dto.verses),
      parseOptionalBool(dto.isProfileVisible),
      parseOptionalBool(dto.isFeedShared),
    );
  }
}
