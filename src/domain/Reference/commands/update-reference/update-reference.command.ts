import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IUpdateReferenceRequestDTO } from '@/domain/Reference/reference.dto';

export class UpdateReferenceCommand implements ICommand {
  readonly commandType = 'UpdateReferenceCommand';

  constructor(
    public readonly id: number,
    public readonly typeId: number | undefined,
    public readonly title: string | undefined,
    public readonly author: string | null | undefined,
  ) {}

  static from(dto: IUpdateReferenceRequestDTO): UpdateReferenceCommand {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');

    const hasType = dto.typeId !== undefined;
    const hasTitle = dto.title !== undefined;
    const hasAuthor = dto.author !== undefined;
    if (!hasType && !hasTitle && !hasAuthor) {
      throw new ValidationError('Provide a title, author, and/or type to update');
    }

    return new UpdateReferenceCommand(id, dto.typeId, dto.title, dto.author);
  }
}
