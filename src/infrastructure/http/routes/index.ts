import { Router } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { bibleRoutes } from './bible.routes';
import { noteRoutes } from './note.routes';
import { referenceRoutes } from './reference.routes';
import { referenceTypeRoutes } from './reference-type.routes';
import { userRoutes } from './user.routes';
import { commentRoutes } from './comment.routes';
import { clerkAuth, requireAuth } from '@/middleware/auth';

export const routes = (
  commandBus: CommandBus,
  queryBus: QueryBus,
  userRepository: IUserRepository,
) => {
  const router = Router();
  const API_VERSION = '/v1';
  const auth = requireAuth(userRepository);

  router.get(`${API_VERSION}/health`, (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // Public scripture corpus
  router.use(`${API_VERSION}/bible`, bibleRoutes(commandBus, queryBus));

  // Authenticated app data — Bible excluded so readers can browse without a session if needed
  router.use(`${API_VERSION}/notes`, auth, noteRoutes(commandBus, queryBus));
  router.use(`${API_VERSION}/reference-types`, auth, referenceTypeRoutes(commandBus, queryBus));
  router.use(`${API_VERSION}/references`, auth, referenceRoutes(commandBus, queryBus));
  router.use(`${API_VERSION}/comments`, auth, commentRoutes(commandBus, queryBus));
  router.use(`${API_VERSION}/users`, userRoutes(commandBus, queryBus, clerkAuth, auth));

  return router;
};
