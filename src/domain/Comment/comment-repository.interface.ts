import { NoteComment } from '@/domain/Comment/note-comment';

export interface ICommentRepository {
  save(comment: NoteComment): Promise<unknown>;
  findById(id: number): Promise<unknown | null>;
  findByNoteId(noteId: number): Promise<unknown[]>;
  softDelete(comment: NoteComment): Promise<unknown>;
}
