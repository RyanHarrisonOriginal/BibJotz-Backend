import { Request, Response } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { User } from '@/domain/User/user';
import { UserMapper } from '@/domain/User/user.mapper';
import { CreateUserCommand } from '@/domain/User/commands/create-user/create-user.command';
import { GetUserQuery } from '@/domain/User/queries/get-user/get-user.query';

export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  createUser = async (req: Request, res: Response): Promise<void> => {
    const command = CreateUserCommand.from(req.body);
    const result = await this.commandBus.execute<CreateUserCommand, User>(command);
    res.status(201).json(UserMapper.mapUserToResponseDTO(result));
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    const query = GetUserQuery.from(req.params);
    const result = await this.queryBus.execute<GetUserQuery, User>(query);
    res.json(UserMapper.mapUserToResponseDTO(result));
  };
}
