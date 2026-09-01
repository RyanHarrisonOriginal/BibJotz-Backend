import { CommandBus } from './command-bus';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { IReferenceTypeRepository } from '@/domain/Reference/reference-type-repository.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { CreateNoteCommandHandler } from '@/domain/Note/commands/create-note/create-note-command.handler';
import { UpdateNoteCommandHandler } from '@/domain/Note/commands/update-note/update-note-command.handler';
import { DeleteNoteCommandHandler } from '@/domain/Note/commands/delete-note/delete-note-command.handler';
import { TagNoteCommandHandler } from '@/domain/Note/commands/tag-note/tag-note-command.handler';
import { UntagNoteCommandHandler } from '@/domain/Note/commands/untag-note/untag-note-command.handler';
import { CreateUserCommandHandler } from '@/domain/User/commands/create-user/create-user-command.handler';
import { CreateReferenceTypeCommandHandler } from '@/domain/Reference/commands/create-reference-type/create-reference-type-command.handler';
import { UpdateReferenceTypeCommandHandler } from '@/domain/Reference/commands/update-reference-type/update-reference-type-command.handler';
import { DeleteReferenceTypeCommandHandler } from '@/domain/Reference/commands/delete-reference-type/delete-reference-type-command.handler';
import { CreateReferenceCommandHandler } from '@/domain/Reference/commands/create-reference/create-reference-command.handler';
import { UpdateReferenceCommandHandler } from '@/domain/Reference/commands/update-reference/update-reference-command.handler';
import { DeleteReferenceCommandHandler } from '@/domain/Reference/commands/delete-reference/delete-reference-command.handler';

export interface ICommandBusSetup {
  noteRepository: INoteRepository;
  userRepository: IUserRepository;
  referenceRepository: IReferenceRepository;
  referenceTypeRepository: IReferenceTypeRepository;
}

export function setupCommandBus(setup: ICommandBusSetup): CommandBus {
  const commandBus = new CommandBus();

  commandBus.registerHandler(
    'CreateNoteCommand',
    new CreateNoteCommandHandler(setup.noteRepository, setup.referenceRepository),
  );
  commandBus.registerHandler('UpdateNoteCommand', new UpdateNoteCommandHandler(setup.noteRepository));
  commandBus.registerHandler('DeleteNoteCommand', new DeleteNoteCommandHandler(setup.noteRepository));
  commandBus.registerHandler(
    'TagNoteCommand',
    new TagNoteCommandHandler(setup.noteRepository, setup.referenceRepository),
  );
  commandBus.registerHandler('UntagNoteCommand', new UntagNoteCommandHandler(setup.noteRepository));
  commandBus.registerHandler('CreateUserCommand', new CreateUserCommandHandler(setup.userRepository));
  commandBus.registerHandler(
    'CreateReferenceTypeCommand',
    new CreateReferenceTypeCommandHandler(setup.referenceTypeRepository),
  );
  commandBus.registerHandler(
    'UpdateReferenceTypeCommand',
    new UpdateReferenceTypeCommandHandler(setup.referenceTypeRepository),
  );
  commandBus.registerHandler(
    'DeleteReferenceTypeCommand',
    new DeleteReferenceTypeCommandHandler(setup.referenceTypeRepository),
  );
  commandBus.registerHandler(
    'CreateReferenceCommand',
    new CreateReferenceCommandHandler(setup.referenceRepository, setup.referenceTypeRepository),
  );
  commandBus.registerHandler(
    'UpdateReferenceCommand',
    new UpdateReferenceCommandHandler(setup.referenceRepository, setup.referenceTypeRepository),
  );
  commandBus.registerHandler(
    'DeleteReferenceCommand',
    new DeleteReferenceCommandHandler(setup.referenceRepository),
  );

  return commandBus;
}
