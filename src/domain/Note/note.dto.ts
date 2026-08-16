import { NoteScope } from '@/domain/shared/value-objects/scripture-reference';

export interface ICreateNoteRequestDTO {
  userId: number;
  content: string;
  bookName: string;
  bookShortName: string;
  chapter?: number | null;
  startVerse?: number | null;
  endVerse?: number | null;
}

export interface IUpdateNoteRequestDTO {
  id?: string;
  content?: string;
  bookName?: string;
  bookShortName?: string;
  chapter?: number | null;
  startVerse?: number | null;
  endVerse?: number | null;
}

export interface IGetNoteParamsDTO {
  id?: string;
}

export interface IDeleteNoteParamsDTO {
  id?: string;
}

export interface IListNotesQueryParamsDTO {
  userId?: string | string[];
  book?: string | string[];
  chapter?: string | string[];
  scope?: string | string[];
}

export interface INoteResponseDTO {
  id: number;
  userId: number;
  content: string;
  bookName: string;
  bookShortName: string;
  chapter: number | null;
  startVerse: number | null;
  endVerse: number | null;
  scope: NoteScope;
  referenceLabel: string;
  createdAt: string;
  updatedAt: string;
}
