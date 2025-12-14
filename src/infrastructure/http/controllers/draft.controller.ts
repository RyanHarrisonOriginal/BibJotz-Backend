import { Request, Response } from "express";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { IDraftDTO } from "@/domain/Drafts/draft.dto";
import { CreateDraftCommand } from "@/domain/Drafts/commands/create-draft/create-draft.command";
import { UpdateDraftCommand } from "@/domain/Drafts/commands/update-draft/update-draft.command";
import { DeleteDraftCommand } from "@/domain/Drafts/commands/delete-draft/delete-draft.command";
import { GetDraftByDraftKeyQuery } from "@/domain/Drafts/queries/get-draft-by-id/get-draft-by-id.query";
import { GetAllDraftsByAuthorQuery } from "@/domain/Drafts/queries/get-all-drafts-by-author/get-all-drafts-by-author.query";

export class DraftController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    createDraft = async (req: Request, res: Response) => {
        try {
            
            //console.log(JSON.stringify(req.body));
            const command = new CreateDraftCommand(
                req.body.userId,
                req.body.name,
                req.body.draftKey,
                req.body.draftContent
            );
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    updateDraft = async (req: Request, res: Response) => {
        try {
            const draftKey = req.params.draftKey;
            const { draftContent }: { draftContent?: Record<string, any> } = req.body;
            const command = new UpdateDraftCommand(draftKey, draftContent);
            const result = await this.commandBus.execute(command);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    deleteDraft = async (req: Request, res: Response) => {
        try {
            const draftId = parseInt(req.params.draftId);
            const command = new DeleteDraftCommand(draftId);
            await this.commandBus.execute(command);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    getDraftByDraftKey = async (req: Request, res: Response) => {
        try {
            const draftKey = req.params.draftKey;
            const query = new GetDraftByDraftKeyQuery(draftKey);
            const result = await this.queryBus.execute(query);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    getAllDraftsByUserId = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req.params.userId);
            const query = new GetAllDraftsByAuthorQuery(userId);
            const result = await this.queryBus.execute(query);
            console.log(result);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

