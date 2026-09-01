import { Request, Response } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { ReferenceType } from '@/domain/Reference/reference-type';
import { ReferenceTypeMapper } from '@/domain/Reference/reference-type.mapper';
import { CreateReferenceTypeCommand } from '@/domain/Reference/commands/create-reference-type/create-reference-type.command';
import { UpdateReferenceTypeCommand } from '@/domain/Reference/commands/update-reference-type/update-reference-type.command';
import { DeleteReferenceTypeCommand } from '@/domain/Reference/commands/delete-reference-type/delete-reference-type.command';
import { ListReferenceTypesQuery } from '@/domain/Reference/queries/list-reference-types/list-reference-types.query';

export class ReferenceTypeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  createType = async (req: Request, res: Response): Promise<void> => {
    const command = CreateReferenceTypeCommand.from(req.body);
    const result = await this.commandBus.execute<CreateReferenceTypeCommand, ReferenceType>(command);
    res.status(201).json(ReferenceTypeMapper.mapReferenceTypeToResponseDTO(result));
  };

  updateType = async (req: Request, res: Response): Promise<void> => {
    const command = UpdateReferenceTypeCommand.from({ ...req.params, ...req.body });
    const result = await this.commandBus.execute<UpdateReferenceTypeCommand, ReferenceType>(command);
    res.json(ReferenceTypeMapper.mapReferenceTypeToResponseDTO(result));
  };

  deleteType = async (req: Request, res: Response): Promise<void> => {
    const command = DeleteReferenceTypeCommand.from(req.params);
    await this.commandBus.execute(command);
    res.status(204).send();
  };

  listTypes = async (req: Request, res: Response): Promise<void> => {
    const query = ListReferenceTypesQuery.from(req.query);
    const result = await this.queryBus.execute<ListReferenceTypesQuery, ReferenceType[]>(query);
    res.json(ReferenceTypeMapper.mapReferenceTypesToResponseDTO(result));
  };
}
