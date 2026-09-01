import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IDeleteReferenceParamsDTO } from '@/domain/Reference/reference.dto';

export class DeleteReferenceCommand implements ICommand {
  readonly commandType = 'DeleteReferenceCommand';

  constructor(public readonly id: number) {}

  static from(dto: IDeleteReferenceParamsDTO): DeleteReferenceCommand {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');
    return new DeleteReferenceCommand(id);
  }
}
