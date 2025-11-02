import { IChurchRepository } from '@/domain/Church/church-repository.interface';
import { CommandBus } from './command-bus';
import { CreateUserCommandHandler } from '@/domain/User/commands/create-user/create-user-command.handler';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { CreateChurchCommandHandler } from '@/domain/Church/commands/create-church/create-church-command.handler';
import { IGuideRepository } from '@/domain/Guide/guide-repository.interface';
import { CreateGuideCommandHandler } from '@/domain/Guide/commands/create-guide/create-guide-command.handler';
import { AddGuideSectionCommandHandler } from '@/domain/Guide/commands/add-guide-section/add-guide-section-command.handler';
import { AddBiblicalReferenceToGuideCommandHandler } from '@/domain/Guide/commands/add-biblical-reference-to-guide/add-biblical-reference-to-guide-command.handler';
import { AddBiblicalReferenceToGuideSectionCommandHandler } from '@/domain/Guide/commands/add-biblical-reference-to-guide-section/add-biblical-reference-to-guide-section-command.handler';
import { IJourneyRepository } from '@/domain/Jouney/journey-repository.interface';
import { CreateJourneyCommandHandler } from '@/domain/Jouney/commands/create-journey/create-journey-command.handler';
import { CreateReflectionCommandHandler } from '@/domain/Reflection/commands/create-reflection/create-reflection-command.handler';
import { AddBiblicalReferencesToReflectionCommandHandler } from '@/domain/Reflection/commands/add-biblical-references-to-reflection/add-biblical-reference-to-reflection-command.handler';
import { IReflectionRepository } from '@/domain/Reflection/reflection-repository.interface';


interface ICommandBusSetup {
  userRepository: IUserRepository;
  churchRepository: IChurchRepository;
  guideRepository: IGuideRepository;
  journeyRepository: IJourneyRepository;
  reflectionRepository: IReflectionRepository;
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

  const addBiblicalReferenceToGuideHandler = new AddBiblicalReferenceToGuideCommandHandler(commandBusSetup.guideRepository);
  commandBus.registerHandler('AddBiblicalReferenceToGuideCommand', addBiblicalReferenceToGuideHandler);

  const addBiblicalReferenceToGuideSectionHandler = new AddBiblicalReferenceToGuideSectionCommandHandler(commandBusSetup.guideRepository);
  commandBus.registerHandler('AddBiblicalReferenceToGuideSectionCommand', addBiblicalReferenceToGuideSectionHandler);

  const createJourneyHandler = new CreateJourneyCommandHandler(commandBusSetup.journeyRepository);
  commandBus.registerHandler('CreateJourneyCommand', createJourneyHandler);

  const createReflectionHandler = new CreateReflectionCommandHandler(commandBusSetup.reflectionRepository);
  commandBus.registerHandler('CreateReflectionCommand', createReflectionHandler);

  const addBiblicalReferencesToReflectionHandler = new AddBiblicalReferencesToReflectionCommandHandler(commandBusSetup.reflectionRepository);
  commandBus.registerHandler('AddBiblicalReferencesToReflectionCommand', addBiblicalReferencesToReflectionHandler);

  return commandBus;
}
