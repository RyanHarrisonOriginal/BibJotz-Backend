import { AddBiblicalReferencesToReflectionCommand } from "@/domain/Reflection/commands/add-biblical-references-to-reflection/add-biblical-reference-to-reflection.command";
import { CreateReflectionCommand } from "@/domain/Reflection/commands/create-reflection/create-reflection.command";
import { SaveReflectionCommand } from "@/domain/Reflection/commands/save-reflection/save-reflection.command";
import { UpsertReflectionCommand } from "@/domain/Reflection/commands/upsert-reflection/upsert-reflection.command";
import { Reflection } from "@/domain/Reflection/reflection";
import { ReflectionMapper } from "@/domain/Reflection/reflection.mapper";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { Request, Response } from "express";

export class ReflectionController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    createReflection = async (req: Request, res: Response) => {
        try {
            const command = CreateReflectionCommand.from(req.body);
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    saveReflection = async (req: Request, res: Response) => {
        try {
            const command = SaveReflectionCommand.from(req.params.reflectionId, req.body);
            const result = await this.commandBus.execute(command) as Reflection;
            const responseDto = ReflectionMapper.mapReflectionToResponseDTO(result);
            res.status(200).json(responseDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    /** PUT upsert: idempotent create-or-update by entry_key. */
    upsertReflection = async (req: Request, res: Response) => {
        try {
            const command = UpsertReflectionCommand.from(req.body);
            const result = await this.commandBus.execute(command) as Reflection;
            const responseDto = ReflectionMapper.mapReflectionToResponseDTO(result);
            res.status(200).json(responseDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    addBiblicalReferencesToReflection = async (req: Request, res: Response) => {
        try {
            const command = AddBiblicalReferencesToReflectionCommand.from({
                reflectionId: req.params.reflectionId,
                biblicalReferences: req.body,
            });
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }
}