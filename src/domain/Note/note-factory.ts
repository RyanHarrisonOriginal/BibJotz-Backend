import { Note } from '@/domain/Note/note';
import { ScriptureReference } from '@/domain/shared/value-objects/scripture-reference';
import { TaggedReference } from '@/domain/Note/tagged-reference';

export interface INoteCreationProps {
  id: number | null;
  userId: number;
  content: string;
  scriptureReference: ScriptureReference;
  taggedReferences?: TaggedReference[];
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
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}
