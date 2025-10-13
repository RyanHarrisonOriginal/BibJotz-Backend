import { CreateGuideCommand } from "@/domain/Guide/commands/create-guide/create-guide.command";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { Request, Response } from "express";
import { IBiblicalReferenceDTO, IGuideDTO, IGuideSectionDTO } from "@/domain/Guide/guide.dto";
import { AddGuideSectionCommand } from "@/domain/Guide/commands/add-guide-section/add-guide-section.command";
import { GetGuideByIdQuery } from "@/domain/Guide/queries/get-guide-by-id/get-guide-by-id.command";
import { AddBiblicalReferenceToGuideCommand } from "@/domain/Guide/commands/add-biblical-reference-to-guide/add-biblical-reference-to-guide.command";
import { AddBiblicalReferenceToGuideSectionCommand } from "@/domain/Guide/commands/add-biblical-reference-to-guide-section/add-biblical-reference-to-guide-section.command";


export class GuideController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}


    createGuide = async (req: Request, res: Response) => {
        try {
        const dto: IGuideDTO = req.body;
        const command = new CreateGuideCommand(
            dto.name,
            dto.description,
            dto.isPublic,
            dto.biblicalReferences,
            dto.guideSections,
            dto.authorId
        );
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    addGuideSection = async (req: Request, res: Response) => {
        try {
            const dto: IGuideSectionDTO = req.body;
            const guideId = parseInt(req.params.guideId);
            const command = new AddGuideSectionCommand(guideId, dto);
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    addBiblicalReferenceToGuide = async (req: Request, res: Response) => {
        try {
            const dto: IBiblicalReferenceDTO[] = req.body;
            const guideId = parseInt(req.params.guideId);
            const command = new AddBiblicalReferenceToGuideCommand(guideId, dto);
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    addBiblicalReferenceToGuideSection = async (req: Request, res: Response) => {
        try {
            const dto: IBiblicalReferenceDTO[] = req.body;
            const guideId = parseInt(req.params.guideId);
            const sectionId = parseInt(req.params.sectionId);
            const command = new AddBiblicalReferenceToGuideSectionCommand(guideId, sectionId, dto);
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    getGuideById = async (req: Request, res: Response) => {
        try {
        const guideId = parseInt(req.params.guideId);
        const query = new GetGuideByIdQuery(guideId);
        const result = await this.queryBus.execute(query);
        res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }
}