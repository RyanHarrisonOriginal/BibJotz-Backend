import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { ICreateUserRequestDTO } from '@/domain/User/user.dto';

export class CreateUserCommand implements ICommand {
  readonly commandType = 'CreateUserCommand';

  constructor(
    public readonly displayName: string,
    public readonly clerkUserId: string,
    public readonly username: string | null,
    public readonly bio: string | null,
  ) {}

  static from(dto: ICreateUserRequestDTO): CreateUserCommand {
    const displayName = dto.displayName?.trim() || 'Reader';
    const clerkUserId = dto.clerkUserId?.trim();
    if (!clerkUserId) throw new ValidationError('clerkUserId is required');
    return new CreateUserCommand(
      displayName,
      clerkUserId,
      dto.username?.trim() || null,
      dto.bio?.trim() || null,
    );
  }
}
