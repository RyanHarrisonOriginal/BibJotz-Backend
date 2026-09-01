import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IDeleteReferenceTypeParamsDTO } from '@/domain/Reference/reference-type.dto';

export class DeleteReferenceTypeCommand implements ICommand {
  readonly commandType = 'DeleteReferenceTypeCommand';

  constructor(public readonly id: number) {}

  static from(dto: IDeleteReferenceTypeParamsDTO): DeleteReferenceTypeCommand {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');
    return new DeleteReferenceTypeCommand(id);
  }
}
