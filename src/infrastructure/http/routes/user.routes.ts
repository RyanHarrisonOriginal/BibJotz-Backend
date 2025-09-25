import { Router } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { UserController } from '../controllers/user.controller';

export const userRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
const router = Router();
const userController = new UserController(commandBus, queryBus);
router.post('/',  userController.createUser);
router.get('/:id', userController.getUser);
return router;
};
