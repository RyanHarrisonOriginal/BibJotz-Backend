import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { ICreateReferenceTypeRequestDTO } from '@/domain/Reference/reference-type.dto';

export class CreateReferenceTypeCommand implements ICommand {
  readonly commandType = 'CreateReferenceTypeCommand';

  constructor(
    public readonly userId: number,
    public readonly name: string,
  ) {}

  static from(dto: ICreateReferenceTypeRequestDTO): CreateReferenceTypeCommand {
    const userId = Number(dto.userId);
    if (!userId || Number.isNaN(userId)) throw new ValidationError('userId is required');
    if (!dto.name?.trim()) throw new ValidationError('name is required');
    return new CreateReferenceTypeCommand(userId, dto.name);
  }
}
