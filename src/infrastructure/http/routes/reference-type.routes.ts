import { Router } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { ReferenceTypeController } from '@/infrastructure/http/controllers/reference-type.controller';
import { asyncHandler } from '@/middleware/asyncHandler';

export const referenceTypeRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
  const router = Router();
  const controller = new ReferenceTypeController(commandBus, queryBus);

  router.post('/', asyncHandler(controller.createType));
  router.get('/', asyncHandler(controller.listTypes));
  router.patch('/:id', asyncHandler(controller.updateType));
  router.delete('/:id', asyncHandler(controller.deleteType));

  return router;
};
