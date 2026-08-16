import { Router } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { bibleRoutes } from './bible.routes';
import { noteRoutes } from './note.routes';
import { userRoutes } from './user.routes';

export const routes = (commandBus: CommandBus, queryBus: QueryBus) => {
  const router = Router();
  const API_VERSION = '/v1';

  router.get(`${API_VERSION}/health`, (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  router.use(`${API_VERSION}/bible`, bibleRoutes(commandBus, queryBus));
  router.use(`${API_VERSION}/notes`, noteRoutes(commandBus, queryBus));
  router.use(`${API_VERSION}/users`, userRoutes(commandBus, queryBus));

  return router;
};
