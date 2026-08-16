import { Router } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { UserController } from '@/infrastructure/http/controllers/user.controller';
import { asyncHandler } from '@/middleware/asyncHandler';

export const userRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
  const router = Router();
  const controller = new UserController(commandBus, queryBus);

  router.post('/', asyncHandler(controller.createUser));
  router.get('/:id', asyncHandler(controller.getUser));

  return router;
};
