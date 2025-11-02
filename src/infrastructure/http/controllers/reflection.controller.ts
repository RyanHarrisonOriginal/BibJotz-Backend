import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { AddBiblicalReferencesToReflectionCommand } from "@/domain/Reflection/commands/add-biblical-references-to-reflection/add-biblical-reference-to-reflection.command";
import { CreateReflectionCommand } from "@/domain/Reflection/commands/create-reflection/create-reflection.command";
import { IReflectionDTO } from "@/domain/Reflection/reflection.dto";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { Request, Response } from "express";

export class ReflectionController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    createReflection = async (req: Request, res: Response) => {
        try {
            const { journeyId, content, authorId, guideSectionId, biblicalReferences }: IReflectionDTO = req.body;
            const command = new CreateReflectionCommand(journeyId, content, authorId, guideSectionId, biblicalReferences);
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    addBiblicalReferencesToReflection = async (req: Request, res: Response) => {
        try {
            const reflectionId = parseInt(req.params.reflectionId);
            const biblicalReferences: IBiblicalReferenceDTO[] = req.body;
            const command = new AddBiblicalReferencesToReflectionCommand(reflectionId, biblicalReferences);
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }
}