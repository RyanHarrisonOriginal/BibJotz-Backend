import { Router } from 'express';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { SearchController } from '@/infrastructure/http/controllers/search.controller';
import { asyncHandler } from '@/middleware/asyncHandler';

export const searchRoutes = (queryBus: QueryBus) => {
  const router = Router();
  const controller = new SearchController(queryBus);
  router.get('/', asyncHandler(controller.search));
  return router;
};
