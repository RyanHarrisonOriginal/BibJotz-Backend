import { Note } from '@/domain/Note/note';
import { ScriptureReference } from '@/domain/shared/value-objects/scripture-reference';
import { TaggedReference } from '@/domain/Note/tagged-reference';
import { NoteAudience } from '@/domain/Note/note-audience';

export interface INoteCreationProps {
  id: number | null;
  userId: number;
  content: string;
  scriptureReference: ScriptureReference;
  taggedReferences?: TaggedReference[];
  audience?: NoteAudience;
  createdAt?: Date;
  updatedAt?: Date;
}

export class NoteFactory {
  static create(data: INoteCreationProps): Note {
    return new Note(
      data.id,
      data.userId,
      data.content,
      data.scriptureReference,
      data.taggedReferences ?? [],
      data.audience ?? 'PRIVATE',
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}
