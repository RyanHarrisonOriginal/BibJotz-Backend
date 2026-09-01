import { NoteScope, VerseSpan } from '@/domain/shared/value-objects/scripture-reference';

export interface ICreateNoteRequestDTO {
  userId: number;
  content: string;
  bookName: string;
  bookShortName: string;
  chapter?: number | null;
  startVerse?: number | null;
  endVerse?: number | null;
  verses?: number[] | string | null;
  referenceIds?: number[] | string | null;
}

export interface ITagNoteRequestDTO {
  id?: string;
  referenceId?: number;
}

export interface IUntagNoteParamsDTO {
  id?: string;
  referenceId?: string;
}

export interface IUpdateNoteRequestDTO {
  id?: string;
  content?: string;
  bookName?: string;
  bookShortName?: string;
  chapter?: number | null;
  startVerse?: number | null;
  endVerse?: number | null;
  verses?: number[] | string | null;
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

export interface ITaggedReferenceResponseDTO {
  id: number;
  title: string;
  author: string | null;
  typeId: number;
  typeName: string;
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
  spans: VerseSpan[];
  verses: number[];
  scope: NoteScope;
  referenceLabel: string;
  references: ITaggedReferenceResponseDTO[];
  createdAt: string;
  updatedAt: string;
}
