import { NoteScope, VerseSpan } from '@/domain/shared/value-objects/scripture-reference';
import { NoteAudience } from '@/domain/Note/note-audience';

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
  audience?: string | null;
  isProfileVisible?: boolean;
  isFeedShared?: boolean;
}

export interface ITagNoteRequestDTO {
  id?: string;
  referenceId?: number;
  actorUserId?: number;
}

export interface IUntagNoteParamsDTO {
  id?: string;
  referenceId?: string;
  actorUserId?: number;
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
  audience?: string | null;
  isProfileVisible?: boolean;
  isFeedShared?: boolean;
  actorUserId?: number;
}

export interface IGetNoteParamsDTO {
  id?: string;
  viewerUserId?: string | string[];
}

export interface IDeleteNoteParamsDTO {
  id?: string;
  actorUserId?: number;
}

export interface IListNotesQueryParamsDTO {
  userId?: string | string[];
  book?: string | string[];
  chapter?: string | string[];
  scope?: string | string[];
}

export interface IGetNoteStreakQueryParamsDTO {
  userId?: string | string[];
  timeZone?: string | string[];
}

export interface IGetFeedQueryParamsDTO {
  userId?: string | string[];
  limit?: string | string[];
}

export interface IListProfileNotesQueryParamsDTO {
  userId?: string | string[];
  viewerUserId?: string | string[];
}

export interface INoteStreakResponseDTO {
  streak: number;
}

export interface ITaggedReferenceResponseDTO {
  id: number;
  title: string;
  author: string | null;
  typeId: number;
  typeName: string;
}

export interface INoteAuthorResponseDTO {
  id: number;
  displayName: string;
  username: string | null;
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
  audience: NoteAudience;
  author?: INoteAuthorResponseDTO;
  createdAt: string;
  updatedAt: string;
}
