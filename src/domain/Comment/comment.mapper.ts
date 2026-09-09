import { NoteComment } from '@/domain/Comment/note-comment';
import { ICommentResponseDTO } from '@/domain/Comment/comment.dto';

type RawAuthor = {
  id: number;
  displayName: string;
  username: string | null;
};

type RawComment = {
  id: number;
  noteId: number;
  userId: number;
  content: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user?: RawAuthor;
};

export class CommentMapper {
  static mapCommentToDomain(raw: unknown): NoteComment {
    const row = raw as RawComment;
    return new NoteComment(
      row.id,
      row.noteId,
      row.userId,
      row.content,
      row.deletedAt,
      row.createdAt,
      row.updatedAt,
    );
  }

  static mapCommentToResponseDTO(raw: unknown): ICommentResponseDTO {
    const row = raw as RawComment;
    const dto: ICommentResponseDTO = {
      id: row.id,
      noteId: row.noteId,
      userId: row.userId,
      content: row.content,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
    if (row.user) {
      dto.author = {
        id: row.user.id,
        displayName: row.user.displayName,
        username: row.user.username,
      };
    }
    return dto;
  }

  static mapCommentsToResponseDTO(raw: unknown[]): ICommentResponseDTO[] {
    return raw.map((row) => CommentMapper.mapCommentToResponseDTO(row));
  }

  static mapCommentEntityToResponseDTO(comment: NoteComment): ICommentResponseDTO {
    return {
      id: comment.getId() ?? 0,
      noteId: comment.getNoteId(),
      userId: comment.getUserId(),
      content: comment.getContent(),
      createdAt: comment.getCreatedAt().toISOString(),
      updatedAt: comment.getUpdatedAt().toISOString(),
    };
  }
}
