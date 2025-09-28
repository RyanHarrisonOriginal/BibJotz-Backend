import { Router } from 'express';
import { userRoutes } from './user.routes';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { churchRoutes } from './church.routes';
import { guideRoutes } from './guide.routes';


export const routes = (commandBus: CommandBus, queryBus: QueryBus) => {
const router = Router();

// API version prefix
const API_VERSION = '/v1';

// Health check route
router.get(`${API_VERSION}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount route modules
router.use(`${API_VERSION}/users`, userRoutes(commandBus, queryBus));
router.use(`${API_VERSION}/churches`, churchRoutes(commandBus, queryBus));
router.use(`${API_VERSION}/guides`, guideRoutes(commandBus, queryBus));


return router;
};
