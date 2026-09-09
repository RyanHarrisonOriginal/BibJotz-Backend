import { Request, Response } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { DeleteCommentCommand } from '@/domain/Comment/commands/delete-comment/delete-comment.command';
import { requireAuthUserId } from '@/middleware/auth';

export class CommentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  deleteComment = async (req: Request, res: Response): Promise<void> => {
    const command = DeleteCommentCommand.from({
      id: req.params.id,
      userId: String(requireAuthUserId(req)),
    });
    await this.commandBus.execute(command);
    res.status(204).send();
  };
}
