import { Router } from "express";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { ChurchController } from "@/infrastructure/http/controllers/church.controller";

export const churchRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
    const router = Router();
    const churchController = new ChurchController(commandBus, queryBus);
    router.post('/', churchController.createChurch);
    router.get('/', churchController.getAllChurches);
    router.get('/search', churchController.getChurch);
    return router;

};
