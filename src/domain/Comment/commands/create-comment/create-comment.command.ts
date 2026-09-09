import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { ICreateCommentRequestDTO } from '@/domain/Comment/comment.dto';

export class CreateCommentCommand implements ICommand {
  readonly commandType = 'CreateCommentCommand';

  constructor(
    public readonly noteId: number,
    public readonly userId: number,
    public readonly content: string,
  ) {}

  static from(dto: ICreateCommentRequestDTO): CreateCommentCommand {
    const noteId = Number(dto.noteId);
    const userId = Number(dto.userId);
    if (!noteId || Number.isNaN(noteId)) throw new ValidationError('noteId is required');
    if (!userId || Number.isNaN(userId)) throw new ValidationError('userId is required');
    if (!dto.content?.trim()) throw new ValidationError('content is required');
    if (dto.content.trim().length > 1000) {
      throw new ValidationError('content must be 1000 characters or fewer');
    }
    return new CreateCommentCommand(noteId, userId, dto.content.trim());
  }
}
