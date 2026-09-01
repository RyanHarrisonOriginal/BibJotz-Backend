import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { ICreateReferenceRequestDTO } from '@/domain/Reference/reference.dto';

export class CreateReferenceCommand implements ICommand {
  readonly commandType = 'CreateReferenceCommand';

  constructor(
    public readonly userId: number,
    public readonly typeId: number,
    public readonly title: string,
    public readonly author: string | null,
  ) {}

  static from(dto: ICreateReferenceRequestDTO): CreateReferenceCommand {
    const userId = Number(dto.userId);
    if (!userId || Number.isNaN(userId)) throw new ValidationError('userId is required');
    const typeId = Number(dto.typeId);
    if (!typeId || Number.isNaN(typeId)) throw new ValidationError('typeId is required');
    if (!dto.title?.trim()) throw new ValidationError('title is required');
    return new CreateReferenceCommand(userId, typeId, dto.title, dto.author ?? null);
  }
}
