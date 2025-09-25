import { Request, Response } from "express";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { IUserDTO } from "@/domain/User/user.dbt";
import { CreateUserCommand } from "@/domain/User/commands/create-user/creat-user.command";
import { GetUserQuery } from "@/domain/User/queries/get-user/get-user.query";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";


export class UserController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus){}

    createUser =  async (req: Request, res: Response) => {
        const dto: IUserDTO = req.body;
        const command = new CreateUserCommand(
            dto.email,
            dto.username,
            dto.firstName,
            dto.lastName,
            dto.primaryChurchId ?? 0,
            dto.isPublic,
        );
        const result = await this.commandBus.execute(command);
        res.status(201).json(result);
    }

    getUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const query = new GetUserQuery(id);
        const result = await this.queryBus.execute(query);
        res.status(200).json(result);

    }
    
}