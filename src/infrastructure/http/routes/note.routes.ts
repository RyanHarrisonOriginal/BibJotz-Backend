import { Router } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { NoteController } from '@/infrastructure/http/controllers/note.controller';
import { asyncHandler } from '@/middleware/asyncHandler';

export const noteRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
  const router = Router();
  const controller = new NoteController(commandBus, queryBus);

  router.post('/', asyncHandler(controller.createNote));
  router.get('/', asyncHandler(controller.listNotes));
  router.post('/:id/references', asyncHandler(controller.tagNote));
  router.delete('/:id/references/:referenceId', asyncHandler(controller.untagNote));
  router.get('/:id', asyncHandler(controller.getNote));
  router.patch('/:id', asyncHandler(controller.updateNote));
  router.delete('/:id', asyncHandler(controller.deleteNote));

  return router;
};
