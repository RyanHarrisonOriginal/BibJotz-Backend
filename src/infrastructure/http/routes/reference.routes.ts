import { Router } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { ReferenceController } from '@/infrastructure/http/controllers/reference.controller';
import { asyncHandler } from '@/middleware/asyncHandler';

export const referenceRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
  const router = Router();
  const controller = new ReferenceController(commandBus, queryBus);

  router.post('/', asyncHandler(controller.createReference));
  router.get('/', asyncHandler(controller.listReferences));
  router.get('/:id', asyncHandler(controller.getReference));
  router.patch('/:id', asyncHandler(controller.updateReference));
  router.delete('/:id', asyncHandler(controller.deleteReference));

  return router;
};
