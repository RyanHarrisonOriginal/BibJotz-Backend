import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { NoteComment } from '@/domain/Comment/note-comment';
import { ICommentRepository } from '@/domain/Comment/comment-repository.interface';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { canViewNote, resolveFollowGrant, viewableNoteFrom } from '@/domain/Note/can-view-note';
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
    const view = viewableNoteFrom(note);
    const followGrant = await resolveFollowGrant(this.followRepository, command.userId, view);
    if (!canViewNote({ id: command.userId }, view, followGrant)) {
      throw new NotFoundError('Note not found');
    }

    const comment = new NoteComment(null, command.noteId, command.userId, command.content);
    return this.commentRepository.save(comment);
  }
}
