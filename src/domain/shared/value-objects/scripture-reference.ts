import { ValidationError } from '@/domain/shared/errors/validation-error';

export type NoteScope = 'BOOK' | 'CHAPTER' | 'VERSE' | 'VERSE_RANGE' | 'VERSE_SET';

export type VerseSpan = { start: number; end: number };

export interface IScriptureReferenceProps {
  bookName: string;
  bookShortName: string;
  chapter?: number | null;
  startVerse?: number | null;
  endVerse?: number | null;
  verses?: number[] | null;
  spans?: VerseSpan[] | null;
}

const MAX_VERSES = 300;

/**
 * Scripture location a note is attached to.
 * Scope is derived from which fields are set — never stored independently of the reference.
 *
 * Verse selections are stored as compressed spans so one note can cover
 * a single verse, a contiguous range, or non-contiguous verses (John 3:16–18, 21).
 */
export class ScriptureReference {
  readonly bookName: string;
  readonly bookShortName: string;
  readonly chapter: number | null;
  readonly startVerse: number | null;
  readonly endVerse: number | null;
  readonly spans: VerseSpan[];
  readonly scope: NoteScope;

  private constructor(props: {
    bookName: string;
    bookShortName: string;
    chapter: number | null;
    startVerse: number | null;
    endVerse: number | null;
    spans: VerseSpan[];
    scope: NoteScope;
  }) {
    this.bookName = props.bookName;
    this.bookShortName = props.bookShortName;
    this.chapter = props.chapter;
    this.startVerse = props.startVerse;
    this.endVerse = props.endVerse;
    this.spans = props.spans;
    this.scope = props.scope;
  }

  static create(props: IScriptureReferenceProps): ScriptureReference {
    const bookName = props.bookName?.trim();
    const bookShortName = props.bookShortName?.trim();
    if (!bookName) throw new ValidationError('bookName is required');
    if (!bookShortName) throw new ValidationError('bookShortName is required');

    const chapter = ScriptureReference.normalizeInt(props.chapter);
    if (chapter != null && chapter < 1) {
      throw new ValidationError('chapter must be a positive integer');
    }

    const spans = ScriptureReference.resolveSpans(props);
    if (spans.length > 0 && chapter == null) {
      throw new ValidationError('chapter is required when verses are set');
    }

    const startVerse = spans[0]?.start ?? null;
    const endVerse = spans[spans.length - 1]?.end ?? null;
    const scope = ScriptureReference.deriveScope(chapter, spans);

    return new ScriptureReference({
      bookName,
      bookShortName,
      chapter,
      startVerse,
      endVerse,
      spans,
      scope,
    });
  }

  /** Human-readable reference: "John 3:16–18, 21", "John 3:16", "John 3", "John". */
  format(): string {
    if (this.scope === 'BOOK') return this.bookName;
    if (this.scope === 'CHAPTER') return `${this.bookName} ${this.chapter}`;
    const parts = this.spans.map((span) =>
      span.start === span.end ? `${span.start}` : `${span.start}–${span.end}`,
    );
    return `${this.bookName} ${this.chapter}:${parts.join(', ')}`;
  }

  coversVerse(verse: number): boolean {
    return this.spans.some((span) => verse >= span.start && verse <= span.end);
  }

  verseNumbers(): number[] {
    const verses: number[] = [];
    for (const span of this.spans) {
      for (let n = span.start; n <= span.end; n += 1) verses.push(n);
    }
    return verses;
  }

  static compressVerses(verses: number[]): VerseSpan[] {
    const unique = [...new Set(verses.map((n) => Number(n)))]
      .filter((n) => Number.isInteger(n) && n >= 1)
      .sort((a, b) => a - b);
    if (unique.length === 0) return [];
    if (unique.length > MAX_VERSES) {
      throw new ValidationError(`A note can cover at most ${MAX_VERSES} verses`);
    }

    const spans: VerseSpan[] = [];
    let start = unique[0];
    let end = unique[0];
    for (let i = 1; i < unique.length; i += 1) {
      if (unique[i] === end + 1) {
        end = unique[i];
      } else {
        spans.push({ start, end });
        start = unique[i];
        end = unique[i];
      }
    }
    spans.push({ start, end });
    return spans;
  }

  private static resolveSpans(props: IScriptureReferenceProps): VerseSpan[] {
    if (props.verses != null && props.verses.length > 0) {
      return ScriptureReference.compressVerses(props.verses);
    }
    if (props.spans != null && props.spans.length > 0) {
      const verses: number[] = [];
      for (const span of props.spans) {
        const start = ScriptureReference.normalizeInt(span.start);
        const end = ScriptureReference.normalizeInt(span.end) ?? start;
        if (start == null || end == null || end < start) {
          throw new ValidationError('Each verse span needs start and end with end >= start');
        }
        for (let n = start; n <= end; n += 1) verses.push(n);
      }
      return ScriptureReference.compressVerses(verses);
    }

    const startVerse = ScriptureReference.normalizeInt(props.startVerse);
    const endVerse = ScriptureReference.normalizeInt(props.endVerse);
    if (endVerse != null && startVerse == null) {
      throw new ValidationError('startVerse is required when endVerse is set');
    }
    if (startVerse != null && startVerse < 1) {
      throw new ValidationError('startVerse must be a positive integer');
    }
    if (endVerse != null && endVerse < startVerse!) {
      throw new ValidationError('endVerse must be greater than or equal to startVerse');
    }
    if (startVerse == null) return [];
    return ScriptureReference.compressVerses(
      Array.from({ length: (endVerse ?? startVerse) - startVerse + 1 }, (_, i) => startVerse + i),
    );
  }

  private static deriveScope(chapter: number | null, spans: VerseSpan[]): NoteScope {
    if (chapter == null) return 'BOOK';
    if (spans.length === 0) return 'CHAPTER';
    if (spans.length > 1) return 'VERSE_SET';
    if (spans[0].start === spans[0].end) return 'VERSE';
    return 'VERSE_RANGE';
  }

  private static normalizeInt(value: number | null | undefined): number | null {
    if (value == null || value === undefined) return null;
    const n = Number(value);
    if (Number.isNaN(n)) return null;
    return n;
  }
}
