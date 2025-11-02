import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { Router } from "express";
import { JourneyController } from "../controllers/journey.controller";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";


export const journeyRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
    const router = Router();
    const journeyController = new JourneyController(commandBus, queryBus);
    router.post('/', journeyController.createJourney);
    router.get('/', journeyController.findJourney);
    return router;
}   