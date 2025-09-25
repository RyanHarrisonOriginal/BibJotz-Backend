import { IChurchRepository } from '@/domain/Church/church-repository.interface';
import { CommandBus } from './command-bus';
import { CreateUserCommandHandler } from '@/domain/User/commands/create-user/create-user-command.handler';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { CreateChurchCommandHandler } from '@/domain/Church/commands/create-church/create-church-command.handler';


interface ICommandBusSetup {
  userRepository: IUserRepository;
  churchRepository: IChurchRepository;
}

export function setupCommandBus(commandBusSetup: ICommandBusSetup): CommandBus {
  const commandBus = new CommandBus();

  const createUserHandler = new CreateUserCommandHandler(commandBusSetup.userRepository);
  commandBus.registerHandler('CreateUserCommand', createUserHandler);

  const createChurchHandler = new CreateChurchCommandHandler(commandBusSetup.churchRepository);
  commandBus.registerHandler('CreateChurchCommand', createChurchHandler);

  return commandBus;
}
