import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { CommentMapper } from '@/domain/Comment/comment.mapper';
import { ICommentResponseDTO } from '@/domain/Comment/comment.dto';
import { ICommentRepository } from '@/domain/Comment/comment-repository.interface';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { canViewNote, resolveIsFollower, viewableNoteFrom } from '@/domain/Note/can-view-note';
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
    const view = viewableNoteFrom(note);
    const viewer = query.viewerUserId == null ? null : { id: query.viewerUserId };
    const isFollower = await resolveIsFollower(this.followRepository, query.viewerUserId, view);
    if (!canViewNote(viewer, view, isFollower)) {
      throw new NotFoundError('Note not found');
    }

    const rows = await this.commentRepository.findByNoteId(query.noteId);
    return CommentMapper.mapCommentsToResponseDTO(rows);
  }
}
