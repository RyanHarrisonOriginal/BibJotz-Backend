import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { CommentMapper } from '@/domain/Comment/comment.mapper';
import { ICommentResponseDTO } from '@/domain/Comment/comment.dto';
import { ICommentRepository } from '@/domain/Comment/comment-repository.interface';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { ListCommentsQuery } from './list-comments.query';

export class ListCommentsQueryHandler
  implements IQueryHandler<ListCommentsQuery, ICommentResponseDTO[]>
{
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly noteRepository: INoteRepository,
    private readonly followRepository: IFollowRepository,
  ) {}

  async execute(query: ListCommentsQuery): Promise<ICommentResponseDTO[]> {
    const noteRow = await this.noteRepository.findById(query.noteId);
    if (!noteRow) throw new NotFoundError('Note not found');

    const note = NoteMapper.mapNoteToDomain(noteRow);
    const canView = await this.canViewNote(note, query.viewerUserId);
    if (!canView) throw new ValidationError('You cannot view comments on this note');

    const rows = await this.commentRepository.findByNoteId(query.noteId);
    return CommentMapper.mapCommentsToResponseDTO(rows);
  }

  private async canViewNote(
    note: {
      getUserId(): number;
      getIsProfileVisible(): boolean;
      getIsFeedShared(): boolean;
    },
    viewerUserId: number | null,
  ): Promise<boolean> {
    if (viewerUserId != null && note.getUserId() === viewerUserId) return true;
    if (note.getIsProfileVisible()) return true;
    if (!note.getIsFeedShared() || viewerUserId == null) return false;
    const follow = await this.followRepository.findByPair(viewerUserId, note.getUserId());
    return follow != null;
  }
}
