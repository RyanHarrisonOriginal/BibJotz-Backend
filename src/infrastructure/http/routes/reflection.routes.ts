import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { Router } from "express";
import { ReflectionController } from "../controllers/reflection.controller";

export const reflectionRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
    const router = Router();
    const reflectionController = new ReflectionController(commandBus, queryBus);
    router.post('/', reflectionController.createReflection);
    router.put('/', reflectionController.upsertReflection);
    router.patch('/:reflectionId', reflectionController.saveReflection);
    router.post('/:reflectionId/biblical-references', reflectionController.addBiblicalReferencesToReflection);
    return router;
}