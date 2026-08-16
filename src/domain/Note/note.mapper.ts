import { Note } from '@/domain/Note/note';
import { NoteFactory } from '@/domain/Note/note-factory';
import { INoteResponseDTO } from '@/domain/Note/note.dto';
import { ScriptureReference } from '@/domain/shared/value-objects/scripture-reference';

type RawNote = {
  id: number;
  userId: number;
  content: string;
  bookName: string;
  bookShortName: string;
  chapter: number | null;
  startVerse: number | null;
  endVerse: number | null;
  createdAt: Date;
  updatedAt: Date;
};

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
      scope: ref.scope,
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
      }),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static mapNotesToDomain(raw: unknown[]): Note[] {
    return raw.map((row) => NoteMapper.mapNoteToDomain(row));
  }

  static mapNoteToResponseDTO(note: Note): INoteResponseDTO {
    const ref = note.getScriptureReference();
    return {
      id: note.getId() ?? 0,
      userId: note.getUserId(),
      content: note.getContent(),
      bookName: ref.bookName,
      bookShortName: ref.bookShortName,
      chapter: ref.chapter,
      startVerse: ref.startVerse,
      endVerse: ref.endVerse,
      scope: ref.scope,
      referenceLabel: ref.format(),
      createdAt: note.getCreatedAt().toISOString(),
      updatedAt: note.getUpdatedAt().toISOString(),
    };
  }

  static mapNotesToResponseDTO(notes: Note[]): INoteResponseDTO[] {
    return notes.map((note) => NoteMapper.mapNoteToResponseDTO(note));
  }
}
