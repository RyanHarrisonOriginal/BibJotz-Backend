import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IUpdateReferenceTypeRequestDTO } from '@/domain/Reference/reference-type.dto';

export class UpdateReferenceTypeCommand implements ICommand {
  readonly commandType = 'UpdateReferenceTypeCommand';

  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}

  static from(dto: IUpdateReferenceTypeRequestDTO): UpdateReferenceTypeCommand {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');
    if (!dto.name?.trim()) throw new ValidationError('name is required');
    return new UpdateReferenceTypeCommand(id, dto.name);
  }
}
