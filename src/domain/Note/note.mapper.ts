import { Note } from '@/domain/Note/note';
import { NoteFactory } from '@/domain/Note/note-factory';
import { INoteResponseDTO } from '@/domain/Note/note.dto';
import { TaggedReference } from '@/domain/Note/tagged-reference';
import { ScriptureReference, VerseSpan } from '@/domain/shared/value-objects/scripture-reference';

type RawTaggedReference = {
  reference?: {
    id?: number;
    title?: string;
    author?: string | null;
    typeId?: number;
    type?: { id?: number; name?: string };
  };
};

type RawAuthor = {
  id?: number;
  displayName?: string;
  username?: string | null;
};

type RawNote = {
  id: number;
  userId: number;
  content: string;
  bookName: string;
  bookShortName: string;
  chapter: number | null;
  startVerse: number | null;
  endVerse: number | null;
  verseSpans?: unknown;
  isProfileVisible?: boolean;
  isFeedShared?: boolean;
  createdAt: Date;
  updatedAt: Date;
  references?: RawTaggedReference[];
  user?: RawAuthor;
};

function spansFromRaw(row: RawNote): VerseSpan[] | undefined {
  if (!Array.isArray(row.verseSpans) || row.verseSpans.length === 0) return undefined;
  return row.verseSpans.map((span) => {
    const value = span as { start?: number; end?: number };
    return { start: Number(value.start), end: Number(value.end) };
  });
}

function taggedReferencesFromRaw(row: RawNote): TaggedReference[] {
  if (!Array.isArray(row.references)) return [];
  return row.references.flatMap((tag) => {
    const reference = tag.reference;
    if (!reference?.id || !reference.title) return [];
    return [
      new TaggedReference(
        reference.id,
        reference.title,
        reference.author ?? null,
        reference.typeId ?? reference.type?.id ?? 0,
        reference.type?.name ?? '',
      ),
    ];
  });
}

export class NoteMapper {
  static mapNoteToPersistence(note: Note): Record<string, unknown> {
    const ref = note.getScriptureReference();
    return {
      id: note.getId(),
      userId: note.getUserId(),
      content: note.getContent(),
      bookName: ref.bookName,
      bookShortName: ref.bookShortName,
      chapter: ref.chapter,
      startVerse: ref.startVerse,
      endVerse: ref.endVerse,
      verseSpans: ref.spans.length > 0 ? ref.spans : null,
      scope: ref.scope,
      isProfileVisible: note.getIsProfileVisible(),
      isFeedShared: note.getIsFeedShared(),
      taggedReferenceIds: note.getTaggedReferenceIds(),
    };
  }

  static mapNoteToDomain(raw: unknown): Note {
    const row = raw as RawNote;
    return NoteFactory.create({
      id: row.id,
      userId: row.userId,
      content: row.content,
      scriptureReference: ScriptureReference.create({
        bookName: row.bookName,
        bookShortName: row.bookShortName,
        chapter: row.chapter,
        startVerse: row.startVerse,
        endVerse: row.endVerse,
        spans: spansFromRaw(row),
      }),
      taggedReferences: taggedReferencesFromRaw(row),
      isProfileVisible: row.isProfileVisible ?? false,
      isFeedShared: row.isFeedShared ?? false,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static mapNotesToDomain(raw: unknown[]): Note[] {
    return raw.map((row) => NoteMapper.mapNoteToDomain(row));
  }

  static mapNoteToResponseDTO(note: Note, author?: RawAuthor | null): INoteResponseDTO {
    const ref = note.getScriptureReference();
    const dto: INoteResponseDTO = {
      id: note.getId() ?? 0,
      userId: note.getUserId(),
      content: note.getContent(),
      bookName: ref.bookName,
      bookShortName: ref.bookShortName,
      chapter: ref.chapter,
      startVerse: ref.startVerse,
      endVerse: ref.endVerse,
      spans: ref.spans,
      verses: ref.verseNumbers(),
      scope: ref.scope,
      referenceLabel: ref.format(),
      references: note.getTaggedReferences().map((tag) => ({
        id: tag.id,
        title: tag.title,
        author: tag.author,
        typeId: tag.typeId,
        typeName: tag.typeName,
      })),
      isProfileVisible: note.getIsProfileVisible(),
      isFeedShared: note.getIsFeedShared(),
      createdAt: note.getCreatedAt().toISOString(),
      updatedAt: note.getUpdatedAt().toISOString(),
    };

    if (author?.id && author.displayName) {
      dto.author = {
        id: author.id,
        displayName: author.displayName,
        username: author.username ?? null,
      };
    }

    return dto;
  }

  static mapNotesToResponseDTO(notes: Note[]): INoteResponseDTO[] {
    return notes.map((note) => NoteMapper.mapNoteToResponseDTO(note));
  }

  static mapRawNotesToResponseDTO(raw: unknown[]): INoteResponseDTO[] {
    return raw.map((row) => {
      const note = NoteMapper.mapNoteToDomain(row);
      const author = (row as RawNote).user ?? null;
      return NoteMapper.mapNoteToResponseDTO(note, author);
    });
  }
}
