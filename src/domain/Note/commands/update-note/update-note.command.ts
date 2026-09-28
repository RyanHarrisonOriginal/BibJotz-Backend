import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IUpdateNoteRequestDTO } from '@/domain/Note/note.dto';
import { parseActorUserId } from '@/domain/shared/assert-owner';
import { NoteAudience, parseNoteAudience, rejectLegacyVisibilityFields } from '@/domain/Note/note-audience';

function parseVerseList(raw: number[] | string | null | undefined): number[] | null | undefined {
  if (raw === undefined) return undefined;
  if (raw == null || raw === '') return null;
  const values = Array.isArray(raw) ? raw : String(raw).split(',');
  const verses = values
    .map((value) => parseInt(String(value).trim(), 10))
    .filter((n) => !Number.isNaN(n) && n >= 1);
  return verses.length > 0 ? verses : null;
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
    public readonly audience: NoteAudience | undefined,
  ) {}

  static from(dto: IUpdateNoteRequestDTO): UpdateNoteCommand {
    rejectLegacyVisibilityFields(dto);
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
    const hasAudience = dto.audience !== undefined;

    if (!hasContent && !hasReference && !hasAudience) {
      throw new ValidationError('Provide content, scripture reference, and/or audience to update');
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
      hasAudience ? parseNoteAudience(dto.audience) : undefined,
    );
  }
}
