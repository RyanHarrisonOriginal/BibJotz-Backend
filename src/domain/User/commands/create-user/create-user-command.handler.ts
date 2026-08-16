import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { User } from '@/domain/User/user';
import { UserFactory } from '@/domain/User/user-factory';
import { UserMapper } from '@/domain/User/user.mapper';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { CreateUserCommand } from './create-user.command';

export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const user = UserFactory.create({
      id: null,
      displayName: command.displayName,
    });
    const saved = await this.userRepository.save(user);
    return UserMapper.mapUserToDomain(saved);
  }
}
