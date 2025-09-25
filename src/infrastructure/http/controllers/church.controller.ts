import { Request, Response } from "express";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { CreateChurchCommand } from "@/domain/Church/commands/create-church/create-church.command";
import { IChurchDTO } from "@/domain/Church/church.dto";
import { GetChurchQuery } from "@/domain/Church/queries/get-church/get-church.query";
import { GetAllChurchesQuery } from "@/domain/Church/queries/get-all-churches/get-all-churches.query";


export class ChurchController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus){}

     createChurch = async (req: Request, res: Response) => {
        try {
        const dto: IChurchDTO = req.body;
        const command = new CreateChurchCommand(
            dto.name,
            dto.street,
            dto.city,
            dto.state,
            dto.zip,
            dto.website,
            dto.email,
            dto.phone
        );
                const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }

    getAllChurches = async (req: Request, res: Response) => {
        try {
            const query = new GetAllChurchesQuery();
            const result = await this.queryBus.execute(query);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                success: false,
                message: (error as Error).message 
            });
        }
    }

    getChurch = async (req: Request, res: Response) => {
        try {
            const { id, name, city, state, zip } = req.query;
            const query = new GetChurchQuery(
                id as unknown as number,
                name as string,
                city as string,
                state as string,
                zip as string
            );
            const result = await this.queryBus.execute(query);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                success: false,
                message: (error as Error).message 
            });
        }
    }
}