import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ICreateUserRequestDTO } from '@/domain/User/user.dto';

export class CreateUserCommand implements ICommand {
  readonly commandType = 'CreateUserCommand';

  constructor(public readonly displayName: string) {}

  static from(dto: ICreateUserRequestDTO): CreateUserCommand {
    const displayName = dto.displayName?.trim() || 'Reader';
    return new CreateUserCommand(displayName);
  }
}
