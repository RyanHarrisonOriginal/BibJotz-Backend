import { CreateGuideCommand } from "@/domain/Guide/commands/create-guide/create-guide.command";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { Request, Response } from "express";
import { AddGuideSectionCommand } from "@/domain/Guide/commands/add-guide-section/add-guide-section.command";
import { GetGuideByIdQuery } from "@/domain/Guide/queries/get-guide-by-id/get-guide-by-id.command";
import { AddBiblicalReferenceToGuideCommand } from "@/domain/Guide/commands/add-biblical-reference-to-guide/add-biblical-reference-to-guide.command";
import { AddBiblicalReferenceToGuideSectionCommand } from "@/domain/Guide/commands/add-biblical-reference-to-guide-section/add-biblical-reference-to-guide-section.command";
import { GetGuideInfoListQuery } from "@/domain/Guide/queries/get-guide-list/get-guide-info-list.query";
import { PermanentlyDeleteGuideCommand } from "@/domain/Guide/commands/permanently-delete-guide/permanently-delete-guide.command";


export class GuideController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}


    createGuide = async (req: Request, res: Response) => {
        try {
            const command = CreateGuideCommand.from(req.body);
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    addGuideSection = async (req: Request, res: Response) => {
        try {
            const command = AddGuideSectionCommand.from({
                guideId: req.params.guideId,
                guideSection: req.body,
            });
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    addBiblicalReferenceToGuide = async (req: Request, res: Response) => {
        try {
            const command = AddBiblicalReferenceToGuideCommand.from({
                guideId: req.params.guideId,
                biblicalReferences: req.body,
            });
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    addBiblicalReferenceToGuideSection = async (req: Request, res: Response) => {
        try {
            const command = AddBiblicalReferenceToGuideSectionCommand.from({
                guideId: req.params.guideId,
                sectionId: req.params.sectionId,
                biblicalReferences: req.body,
            });
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    getGuideById = async (req: Request, res: Response) => {
        try {
            const query = GetGuideByIdQuery.from(req.params);
            const result = await this.queryBus.execute(query);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    getGuideInfoList = async (req: Request, res: Response) => {
        try {
            const userId = 1; // TODO: get userId from middleware
            const query = GetGuideInfoListQuery.from({ userId });
            const result = await this.queryBus.execute(query);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }


    deleteGuide = async (req: Request, res: Response) => {
        try {
            const userId = 1; // TODO: get userId from middleware
            const command = PermanentlyDeleteGuideCommand.from({
                guideId: req.params.guideId,
                userId,
            });
            const result = await this.commandBus.execute(command);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }
}