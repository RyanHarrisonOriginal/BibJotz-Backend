import { CreateGuideCommand } from "@/domain/Guide/commands/create-guide/create-guide.command";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { Request, Response } from "express";
import { IGuideDTO } from "@/domain/Guide/guide.dto";


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
}