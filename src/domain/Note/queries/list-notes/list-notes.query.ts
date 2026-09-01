import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { NoteScope } from '@/domain/shared/value-objects/scripture-reference';
import { IListNotesQueryParamsDTO } from '@/domain/Note/note.dto';

const SCOPES: NoteScope[] = ['BOOK', 'CHAPTER', 'VERSE', 'VERSE_RANGE', 'VERSE_SET'];

export class ListNotesQuery implements IQuery {
  readonly queryType = 'ListNotesQuery';

  constructor(
    public readonly userId: number,
    public readonly bookName: string | undefined,
    public readonly chapter: number | undefined,
    public readonly scope: NoteScope | undefined,
  ) {}

  static from(dto: IListNotesQueryParamsDTO): ListNotesQuery {
    const userIdRaw = Array.isArray(dto.userId) ? dto.userId[0] : dto.userId;
    const userId = parseInt(String(userIdRaw ?? ''), 10);
    if (Number.isNaN(userId) || userId < 1) throw new ValidationError('userId is required');

    const bookRaw = Array.isArray(dto.book) ? dto.book[0] : dto.book;
    const chapterRaw = Array.isArray(dto.chapter) ? dto.chapter[0] : dto.chapter;
    const scopeRaw = Array.isArray(dto.scope) ? dto.scope[0] : dto.scope;

    let chapter: number | undefined;
    if (chapterRaw != null && chapterRaw !== '') {
      chapter = parseInt(String(chapterRaw), 10);
      if (Number.isNaN(chapter) || chapter < 1) throw new ValidationError('chapter must be a positive integer');
    }

    let scope: NoteScope | undefined;
    if (scopeRaw) {
      const normalized = String(scopeRaw).toUpperCase() as NoteScope;
      if (!SCOPES.includes(normalized)) {
        throw new ValidationError(`scope must be one of ${SCOPES.join(', ')}`);
      }
      scope = normalized;
    }

    return new ListNotesQuery(userId, bookRaw?.trim() || undefined, chapter, scope);
  }
}
