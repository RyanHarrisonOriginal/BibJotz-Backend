import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IUpdateUserRequestDTO } from '@/domain/User/user.dto';

export class UpdateUserCommand implements ICommand {
  readonly commandType = 'UpdateUserCommand';

  constructor(
    public readonly id: number,
    public readonly displayName: string | undefined,
    public readonly clerkUserId: string | null | undefined,
    public readonly username: string | null | undefined,
    public readonly bio: string | null | undefined,
  ) {}

  static from(dto: IUpdateUserRequestDTO): UpdateUserCommand {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');

    const hasUpdate =
      dto.displayName !== undefined ||
      dto.clerkUserId !== undefined ||
      dto.username !== undefined ||
      dto.bio !== undefined;

    if (!hasUpdate) throw new ValidationError('Provide at least one profile field to update');

    return new UpdateUserCommand(
      id,
      dto.displayName?.trim(),
      dto.clerkUserId === undefined ? undefined : dto.clerkUserId?.trim() || null,
      dto.username === undefined ? undefined : dto.username?.trim() || null,
      dto.bio === undefined ? undefined : dto.bio?.trim() || null,
    );
  }
}
