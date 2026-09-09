import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { User } from '@/domain/User/user';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { ensureUserForClerkId } from '@/domain/User/ensure-user';
import { CreateUserCommand } from './create-user.command';

export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    return ensureUserForClerkId(this.userRepository, {
      clerkUserId: command.clerkUserId,
      displayName: command.displayName,
      username: command.username,
      bio: command.bio,
    });
  }
}
