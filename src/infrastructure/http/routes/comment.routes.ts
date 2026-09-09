import { Router } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { CommentController } from '@/infrastructure/http/controllers/comment.controller';
import { asyncHandler } from '@/middleware/asyncHandler';

export const commentRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
  const router = Router();
  const controller = new CommentController(commandBus, queryBus);

  router.delete('/:id', asyncHandler(controller.deleteComment));

  return router;
};
