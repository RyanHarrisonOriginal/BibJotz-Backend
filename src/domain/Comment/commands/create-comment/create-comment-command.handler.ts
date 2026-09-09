import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { NoteComment } from '@/domain/Comment/note-comment';
import { ICommentRepository } from '@/domain/Comment/comment-repository.interface';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { CreateCommentCommand } from './create-comment.command';

export class CreateCommentCommandHandler implements ICommandHandler<CreateCommentCommand, unknown> {
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly noteRepository: INoteRepository,
    private readonly userRepository: IUserRepository,
    private readonly followRepository: IFollowRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<unknown> {
    const [noteRow, userRow] = await Promise.all([
      this.noteRepository.findById(command.noteId),
      this.userRepository.findById(command.userId),
    ]);
    if (!noteRow) throw new NotFoundError('Note not found');
    if (!userRow) throw new NotFoundError('User not found');

    const note = NoteMapper.mapNoteToDomain(noteRow);
    const canComment = await this.canCommentOnNote(note.getUserId(), command.userId, note);
    if (!canComment) {
      throw new ValidationError('You cannot comment on this note');
    }

    const comment = new NoteComment(null, command.noteId, command.userId, command.content);
    return this.commentRepository.save(comment);
  }

  private async canCommentOnNote(
    authorId: number,
    commenterId: number,
    note: { getIsProfileVisible(): boolean; getIsFeedShared(): boolean },
  ): Promise<boolean> {
    if (authorId === commenterId) return true;
    if (note.getIsProfileVisible()) return true;
    if (!note.getIsFeedShared()) return false;
    const follow = await this.followRepository.findByPair(commenterId, authorId);
    return follow != null;
  }
}
