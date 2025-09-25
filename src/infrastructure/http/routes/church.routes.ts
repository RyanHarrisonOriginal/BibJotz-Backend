import { Router } from "express";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { ChurchController } from "@/infrastructure/http/controllers/church.controller";

export const churchRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
    try {
    const router = Router();
    const churchController = new ChurchController(commandBus, queryBus);
    
    // POST routes
    router.post('/', churchController.createChurch);
    
    // GET routes
    router.get('/', churchController.getAllChurches);
    router.get('/search', churchController.getChurch);
    
    return router;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create church routes');
    }
};
