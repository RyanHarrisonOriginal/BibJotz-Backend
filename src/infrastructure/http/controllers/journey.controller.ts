import { CreateJourneyCommand } from "@/domain/Jouney/commands/create-journey/create-journey.command";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { Request, Response } from "express";
import { IJourneyDTO } from "@/domain/Jouney/journey.dto";
import { FindJourneyQuery } from "@/domain/Jouney/commands/queries/find-journey/find-journey.query";




export class JourneyController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
    
    createJourney = async (req: Request, res: Response) => {
        try {
            const dto: IJourneyDTO = req.body;
            const command = new CreateJourneyCommand(
                dto.title,
                dto.ownerId,
                new Date(),
                new Date(),
                dto.guideId,
            );
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    findJourney = async (req: Request, res: Response) => {
        try {
            const {
                id,
                ownerId,
                guideId,
            }: Partial<IJourneyDTO> = req.query;
            const query = new FindJourneyQuery(
                id ? parseInt(id as unknown as string) : undefined,
                ownerId ? parseInt(ownerId as unknown as string) : undefined,
                guideId ? parseInt(guideId as unknown as string) : undefined,
            );
            const result = await this.queryBus.execute(query);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }


}