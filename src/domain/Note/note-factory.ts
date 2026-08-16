import { Note } from '@/domain/Note/note';
import { ScriptureReference } from '@/domain/shared/value-objects/scripture-reference';

export interface INoteCreationProps {
  id: number | null;
  userId: number;
  content: string;
  scriptureReference: ScriptureReference;
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
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}
