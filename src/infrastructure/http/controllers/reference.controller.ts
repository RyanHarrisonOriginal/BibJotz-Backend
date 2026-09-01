import { Request, Response } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { Reference } from '@/domain/Reference/reference';
import { ReferenceMapper } from '@/domain/Reference/reference.mapper';
import { CreateReferenceCommand } from '@/domain/Reference/commands/create-reference/create-reference.command';
import { UpdateReferenceCommand } from '@/domain/Reference/commands/update-reference/update-reference.command';
import { DeleteReferenceCommand } from '@/domain/Reference/commands/delete-reference/delete-reference.command';
import { GetReferenceQuery } from '@/domain/Reference/queries/get-reference/get-reference.query';
import { ListReferencesQuery } from '@/domain/Reference/queries/list-references/list-references.query';

export class ReferenceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  createReference = async (req: Request, res: Response): Promise<void> => {
    const command = CreateReferenceCommand.from(req.body);
    const result = await this.commandBus.execute<CreateReferenceCommand, Reference>(command);
    res.status(201).json(ReferenceMapper.mapReferenceToResponseDTO(result));
  };

  updateReference = async (req: Request, res: Response): Promise<void> => {
    const command = UpdateReferenceCommand.from({ ...req.params, ...req.body });
    const result = await this.commandBus.execute<UpdateReferenceCommand, Reference>(command);
    res.json(ReferenceMapper.mapReferenceToResponseDTO(result));
  };

  deleteReference = async (req: Request, res: Response): Promise<void> => {
    const command = DeleteReferenceCommand.from(req.params);
    await this.commandBus.execute(command);
    res.status(204).send();
  };

  getReference = async (req: Request, res: Response): Promise<void> => {
    const query = GetReferenceQuery.from(req.params);
    const result = await this.queryBus.execute<GetReferenceQuery, Reference>(query);
    res.json(ReferenceMapper.mapReferenceToResponseDTO(result));
  };

  listReferences = async (req: Request, res: Response): Promise<void> => {
    const query = ListReferencesQuery.from(req.query);
    const result = await this.queryBus.execute<ListReferencesQuery, Reference[]>(query);
    res.json(ReferenceMapper.mapReferencesToResponseDTO(result));
  };
}
