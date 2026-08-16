import { CommandBus } from './command-bus';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { CreateNoteCommandHandler } from '@/domain/Note/commands/create-note/create-note-command.handler';
import { UpdateNoteCommandHandler } from '@/domain/Note/commands/update-note/update-note-command.handler';
import { DeleteNoteCommandHandler } from '@/domain/Note/commands/delete-note/delete-note-command.handler';
import { CreateUserCommandHandler } from '@/domain/User/commands/create-user/create-user-command.handler';

export interface ICommandBusSetup {
  noteRepository: INoteRepository;
  userRepository: IUserRepository;
}

export function setupCommandBus(setup: ICommandBusSetup): CommandBus {
  const commandBus = new CommandBus();

  commandBus.registerHandler('CreateNoteCommand', new CreateNoteCommandHandler(setup.noteRepository));
  commandBus.registerHandler('UpdateNoteCommand', new UpdateNoteCommandHandler(setup.noteRepository));
  commandBus.registerHandler('DeleteNoteCommand', new DeleteNoteCommandHandler(setup.noteRepository));
  commandBus.registerHandler('CreateUserCommand', new CreateUserCommandHandler(setup.userRepository));

  return commandBus;
}
