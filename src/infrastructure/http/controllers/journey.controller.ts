import { CreateJourneyCommand } from "@/domain/Jouney/commands/create-journey/create-journey.command";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { Request, Response } from "express";
import { FindJourneyQuery } from "@/domain/Jouney/commands/queries/find-journey/find-journey.query";
import { GetJourneyLibraryQuery } from "@/domain/Jouney/commands/queries/get-journey-library/get-journey-library.query";
import { JourneyMapper } from "@/domain/Jouney/journey.mapper";

export class JourneyController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    createJourney = async (req: Request, res: Response) => {
        try {
            const command = CreateJourneyCommand.from(req.body);
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    findJourney = async (req: Request, res: Response) => {
        try {
            const query = FindJourneyQuery.from(req.query);
            const result = await this.queryBus.execute(query);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    getJourneyLibrary = async (req: Request, res: Response) => {
        try {
            const query = GetJourneyLibraryQuery.from(req.query);
            const result = await this.queryBus.execute(query);
            const responseDto = JourneyMapper.mapJourneyLibraryToResponseDTO(result);
            res.status(200).json(responseDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }
}