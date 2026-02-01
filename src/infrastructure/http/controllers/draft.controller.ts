import { Request, Response } from "express";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { CreateDraftCommand } from "@/domain/Drafts/commands/create-draft/create-draft.command";
import { UpdateDraftCommand } from "@/domain/Drafts/commands/update-draft/update-draft.command";
import { DeleteDraftCommand } from "@/domain/Drafts/commands/delete-draft/delete-draft.command";
import { GetDraftByDraftKeyQuery } from "@/domain/Drafts/queries/get-draft-by-id/get-draft-by-id.query";
import { GetAllDraftsByAuthorQuery } from "@/domain/Drafts/queries/get-all-drafts-by-author/get-all-drafts-by-author.query";
import { PublishDraftCommand } from "@/domain/Drafts/commands/publish-draft/publish-draft.command";

export class DraftController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    createDraft = async (req: Request, res: Response) => {
        try {
            const command = CreateDraftCommand.from(req.body);
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    updateDraft = async (req: Request, res: Response) => {
        try {
            const command = UpdateDraftCommand.from({
                draftKey: req.params.draftKey,
                draftContent: req.body.draftContent,
            });
            const result = await this.commandBus.execute(command);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    deleteDraft = async (req: Request, res: Response) => {
        try {
            const command = DeleteDraftCommand.from(req.params);
            await this.commandBus.execute(command);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    getDraftByDraftKey = async (req: Request, res: Response) => {
        try {
            const query = GetDraftByDraftKeyQuery.from(req.params);
            const result = await this.queryBus.execute(query);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    getAllDraftsByUserId = async (req: Request, res: Response) => {
        try {
            const query = GetAllDraftsByAuthorQuery.from(req.params);
            const result = await this.queryBus.execute(query);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    publishDraft = async (req: Request, res: Response) => {
        try {
            const command = PublishDraftCommand.from(req.params);
            const result = await this.commandBus.execute(command);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

