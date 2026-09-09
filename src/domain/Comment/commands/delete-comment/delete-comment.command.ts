import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IDeleteCommentParamsDTO } from '@/domain/Comment/comment.dto';

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export class DeleteCommentCommand implements ICommand {
  readonly commandType = 'DeleteCommentCommand';

  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}

  static from(dto: IDeleteCommentParamsDTO): DeleteCommentCommand {
    const id = parseInt(String(dto.id ?? ''), 10);
    const userId = parseInt(String(first(dto.userId) ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');
    if (Number.isNaN(userId) || userId < 1) throw new ValidationError('userId is required');
    return new DeleteCommentCommand(id, userId);
  }
}
