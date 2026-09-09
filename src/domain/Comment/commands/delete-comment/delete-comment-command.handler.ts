import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { CommentMapper } from '@/domain/Comment/comment.mapper';
import { ICommentRepository } from '@/domain/Comment/comment-repository.interface';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { DeleteCommentCommand } from './delete-comment.command';

export class DeleteCommentCommandHandler implements ICommandHandler<DeleteCommentCommand, void> {
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly noteRepository: INoteRepository,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const existing = await this.commentRepository.findById(command.id);
    if (!existing) throw new NotFoundError('Comment not found');

    const comment = CommentMapper.mapCommentToDomain(existing);
    if (comment.getDeletedAt()) throw new NotFoundError('Comment not found');

    const noteRow = await this.noteRepository.findById(comment.getNoteId());
    if (!noteRow) throw new NotFoundError('Note not found');
    const note = NoteMapper.mapNoteToDomain(noteRow);

    const isAuthor = comment.getUserId() === command.userId;
    const isNoteOwner = note.getUserId() === command.userId;
    if (!isAuthor && !isNoteOwner) {
      throw new ValidationError('Only the comment author or note owner can delete this comment');
    }

    comment.softDelete();
    await this.commentRepository.softDelete(comment);
  }
}
