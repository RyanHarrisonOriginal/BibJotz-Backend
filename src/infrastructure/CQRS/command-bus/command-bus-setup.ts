import { IChurchRepository } from '@/domain/Church/church-repository.interface';
import { CommandBus } from './command-bus';
import { CreateUserCommandHandler } from '@/domain/User/commands/create-user/create-user-command.handler';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { CreateChurchCommandHandler } from '@/domain/Church/commands/create-church/create-church-command.handler';
import { IGuideRepository } from '@/domain/Guide/guide-repository.interface';
import { CreateGuideCommandHandler } from '@/domain/Guide/commands/create-guide/create-guide-command.handler';
import { AddGuideSectionCommandHandler } from '@/domain/Guide/commands/add-guide-section/add-guide-section-command.handler';


interface ICommandBusSetup {
  userRepository: IUserRepository;
  churchRepository: IChurchRepository;
  guideRepository: IGuideRepository;
}

export function setupCommandBus(commandBusSetup: ICommandBusSetup): CommandBus {
  const commandBus = new CommandBus();

  const createUserHandler = new CreateUserCommandHandler(commandBusSetup.userRepository);
  commandBus.registerHandler('CreateUserCommand', createUserHandler);

  const createChurchHandler = new CreateChurchCommandHandler(commandBusSetup.churchRepository);
  commandBus.registerHandler('CreateChurchCommand', createChurchHandler);

  const createGuideHandler = new CreateGuideCommandHandler(commandBusSetup.guideRepository);
  commandBus.registerHandler('CreateGuideCommand', createGuideHandler);

  const addGuideSectionHandler = new AddGuideSectionCommandHandler(commandBusSetup.guideRepository);
  commandBus.registerHandler('AddGuideSectionCommand', addGuideSectionHandler);

  return commandBus;
}
