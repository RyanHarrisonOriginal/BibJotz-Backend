import { Note } from '@/domain/Note/note';
import { NoteScope } from '@/domain/shared/value-objects/scripture-reference';

export interface INoteListFilters {
  userId: number;
  bookName?: string;
  chapter?: number;
  scope?: NoteScope;
}

export interface IProfileNotesFilters {
  userId: number;
}

export interface IFeedNotesFilters {
  viewerUserId: number;
  limit?: number;
}

export interface INoteSearchFilters {
  query: string;
  limit: number;
}

/**
 * Port: note persistence. Implemented by a Postgres adapter.
 * Returns raw persistence shapes only.
 */
export interface INoteRepository {
  save(note: Note): Promise<unknown>;
  findById(id: number): Promise<unknown | null>;
  findMany(filters: INoteListFilters): Promise<unknown[]>;
  findProfileVisible(filters: IProfileNotesFilters): Promise<unknown[]>;
  findFeedForUser(filters: IFeedNotesFilters): Promise<unknown[]>;
  searchPublic(filters: INoteSearchFilters): Promise<unknown[]>;
  /** Distinct local calendar days (YYYY-MM-DD) with a note, newest first. */
  findDistinctCreatedDays(userId: number, timeZone: string): Promise<string[]>;
  deleteById(id: number): Promise<void>;
}
