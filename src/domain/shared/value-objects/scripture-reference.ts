import { ValidationError } from '@/domain/shared/errors/validation-error';

export type NoteScope = 'BOOK' | 'CHAPTER' | 'VERSE' | 'VERSE_RANGE';

export interface IScriptureReferenceProps {
  bookName: string;
  bookShortName: string;
  chapter?: number | null;
  startVerse?: number | null;
  endVerse?: number | null;
}

/**
 * Scripture location a note is attached to.
 * Scope is derived from which fields are set — never stored independently of the reference.
 */
export class ScriptureReference {
  readonly bookName: string;
  readonly bookShortName: string;
  readonly chapter: number | null;
  readonly startVerse: number | null;
  readonly endVerse: number | null;
  readonly scope: NoteScope;

  private constructor(props: {
    bookName: string;
    bookShortName: string;
    chapter: number | null;
    startVerse: number | null;
    endVerse: number | null;
    scope: NoteScope;
  }) {
    this.bookName = props.bookName;
    this.bookShortName = props.bookShortName;
    this.chapter = props.chapter;
    this.startVerse = props.startVerse;
    this.endVerse = props.endVerse;
    this.scope = props.scope;
  }

  static create(props: IScriptureReferenceProps): ScriptureReference {
    const bookName = props.bookName?.trim();
    const bookShortName = props.bookShortName?.trim();
    if (!bookName) throw new ValidationError('bookName is required');
    if (!bookShortName) throw new ValidationError('bookShortName is required');

    const chapter = ScriptureReference.normalizeInt(props.chapter);
    const startVerse = ScriptureReference.normalizeInt(props.startVerse);
    const endVerse = ScriptureReference.normalizeInt(props.endVerse);

    if (startVerse != null && chapter == null) {
      throw new ValidationError('chapter is required when verses are set');
    }
    if (endVerse != null && startVerse == null) {
      throw new ValidationError('startVerse is required when endVerse is set');
    }
    if (chapter != null && chapter < 1) {
      throw new ValidationError('chapter must be a positive integer');
    }
    if (startVerse != null && startVerse < 1) {
      throw new ValidationError('startVerse must be a positive integer');
    }
    if (endVerse != null && endVerse < startVerse!) {
      throw new ValidationError('endVerse must be greater than or equal to startVerse');
    }

    const scope = ScriptureReference.deriveScope(chapter, startVerse, endVerse);
    return new ScriptureReference({
      bookName,
      bookShortName,
      chapter,
      startVerse,
      endVerse: scope === 'VERSE' ? startVerse : endVerse,
      scope,
    });
  }

  /** Human-readable reference: "John 3:16", "John 3:16–18", "John 3", "John". */
  format(): string {
    if (this.scope === 'BOOK') return this.bookName;
    if (this.scope === 'CHAPTER') return `${this.bookName} ${this.chapter}`;
    if (this.scope === 'VERSE') return `${this.bookName} ${this.chapter}:${this.startVerse}`;
    return `${this.bookName} ${this.chapter}:${this.startVerse}–${this.endVerse}`;
  }

  private static deriveScope(
    chapter: number | null,
    startVerse: number | null,
    endVerse: number | null,
  ): NoteScope {
    if (chapter == null) return 'BOOK';
    if (startVerse == null) return 'CHAPTER';
    if (endVerse == null || endVerse === startVerse) return 'VERSE';
    return 'VERSE_RANGE';
  }

  private static normalizeInt(value: number | null | undefined): number | null {
    if (value == null || value === undefined) return null;
    const n = Number(value);
    if (Number.isNaN(n)) return null;
    return n;
  }
}
