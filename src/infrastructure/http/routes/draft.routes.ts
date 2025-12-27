import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { Router } from "express";
import { DraftController } from "../controllers/draft.controller";

export const draftRoutes = (commandBus: CommandBus, queryBus: QueryBus) => {
    const router = Router();
    const draftController = new DraftController(commandBus, queryBus);
    
    router.post('/', draftController.createDraft);
    router.get('/:draftKey', draftController.getDraftByDraftKey);
    router.post('/:draftKey/publish', draftController.publishDraft);
    router.put('/:draftKey', draftController.updateDraft);
    router.delete('/:draftKey', draftController.deleteDraft);
    router.get('/user/:userId', draftController.getAllDraftsByUserId);
    
    return router;
}

