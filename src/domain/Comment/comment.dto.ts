export interface ICreateCommentRequestDTO {
  noteId?: number | string;
  userId?: number;
  content?: string;
}

export interface IDeleteCommentParamsDTO {
  id?: string;
  userId?: string | string[];
}

export interface IListCommentsQueryParamsDTO {
  noteId?: string;
  viewerUserId?: string | string[];
}

export interface ICommentAuthorResponseDTO {
  id: number;
  displayName: string;
  username: string | null;
}

export interface ICommentResponseDTO {
  id: number;
  noteId: number;
  userId: number;
  content: string;
  author?: ICommentAuthorResponseDTO;
  createdAt: string;
  updatedAt: string;
}
