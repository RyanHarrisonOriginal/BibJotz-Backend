import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { User } from '@/domain/User/user';
import { UserMapper } from '@/domain/User/user.mapper';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { UpdateUserCommand } from './update-user.command';

export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const existing = await this.userRepository.findById(command.id);
    if (!existing) throw new NotFoundError('User not found');

    const user = UserMapper.mapUserToDomain(existing);
    user.updateProfile({
      displayName: command.displayName,
      clerkUserId: command.clerkUserId,
      username: command.username,
      bio: command.bio,
    });

    const saved = await this.userRepository.save(user);
    return UserMapper.mapUserToDomain(saved);
  }
}
