import { GuideController } from "../controllers/guide.controller";
import { Router } from "express";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";



export const guideRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
    const router = Router();
    const guideController = new GuideController(commandBus, queryBus);
    router.post('/', guideController.createGuide);
    router.post('/:guideId/sections', guideController.addGuideSection);
    router.get('/:guideId', guideController.getGuideById);
    router.post('/:guideId/biblical-references', guideController.addBiblicalReferenceToGuide);
    router.post('/:guideId/sections/:sectionId/biblical-references', guideController.addBiblicalReferenceToGuideSection);
    return router;
}
