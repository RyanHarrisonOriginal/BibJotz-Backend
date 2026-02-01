import { Request, Response } from "express";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { CreateUserCommand } from "@/domain/User/commands/create-user/create-user.command";
import { GetUserQuery } from "@/domain/User/queries/get-user/get-user.query";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";

export class UserController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    createUser = async (req: Request, res: Response) => {
        const command = CreateUserCommand.from(req.body);
        const result = await this.commandBus.execute(command);
        res.status(201).json(result);
    }

    getUser = async (req: Request, res: Response) => {
        const query = GetUserQuery.from(req.params);
        const result = await this.queryBus.execute(query);
        res.status(200).json(result);
    }
}