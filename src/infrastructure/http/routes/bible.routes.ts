import { Router } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { BibleController } from '@/infrastructure/http/controllers/bible.controller';
import { asyncHandler } from '@/middleware/asyncHandler';

export const bibleRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
  const router = Router();
  const controller = new BibleController(commandBus, queryBus);

  router.get('/translations', asyncHandler(controller.getTranslations));
  router.get('/books', asyncHandler(controller.getBooks));
  router.get('/books/:bookName', asyncHandler(controller.getBookInfo));
  router.get('/books/:bookName/chapters/:chapterNumber', asyncHandler(controller.getChapterInfo));
  router.get('/books/:bookName/chapters/:chapterNumber/verses', asyncHandler(controller.getPassage));

  return router;
};
