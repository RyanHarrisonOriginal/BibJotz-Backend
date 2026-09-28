import { CommandBus } from './command-bus';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { IReferenceTypeRepository } from '@/domain/Reference/reference-type-repository.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { ICommentRepository } from '@/domain/Comment/comment-repository.interface';
import { CreateNoteCommandHandler } from '@/domain/Note/commands/create-note/create-note-command.handler';
import { UpdateNoteCommandHandler } from '@/domain/Note/commands/update-note/update-note-command.handler';
import { DeleteNoteCommandHandler } from '@/domain/Note/commands/delete-note/delete-note-command.handler';
import { TagNoteCommandHandler } from '@/domain/Note/commands/tag-note/tag-note-command.handler';
import { UntagNoteCommandHandler } from '@/domain/Note/commands/untag-note/untag-note-command.handler';
import { CreateUserCommandHandler } from '@/domain/User/commands/create-user/create-user-command.handler';
import { UpdateUserCommandHandler } from '@/domain/User/commands/update-user/update-user-command.handler';
import { CreateReferenceTypeCommandHandler } from '@/domain/Reference/commands/create-reference-type/create-reference-type-command.handler';
import { UpdateReferenceTypeCommandHandler } from '@/domain/Reference/commands/update-reference-type/update-reference-type-command.handler';
import { DeleteReferenceTypeCommandHandler } from '@/domain/Reference/commands/delete-reference-type/delete-reference-type-command.handler';
import { CreateReferenceCommandHandler } from '@/domain/Reference/commands/create-reference/create-reference-command.handler';
import { UpdateReferenceCommandHandler } from '@/domain/Reference/commands/update-reference/update-reference-command.handler';
import { DeleteReferenceCommandHandler } from '@/domain/Reference/commands/delete-reference/delete-reference-command.handler';
import { IFollowEventPublisher } from '@/domain/Follow/ports/follow-event-publisher.port';
import { FollowUserCommandHandler } from '@/domain/Follow/commands/follow-user/follow-user-command.handler';
import { UnfollowUserCommandHandler } from '@/domain/Follow/commands/unfollow-user/unfollow-user-command.handler';
import { AcceptFollowRequestCommandHandler } from '@/domain/Follow/commands/accept-follow-request/accept-follow-request-command.handler';
import { DeclineFollowRequestCommandHandler } from '@/domain/Follow/commands/decline-follow-request/decline-follow-request-command.handler';
import { RemoveFollowerCommandHandler } from '@/domain/Follow/commands/remove-follower/remove-follower-command.handler';
import { UpdateFollowSettingsCommandHandler } from '@/domain/Follow/commands/update-follow-settings/update-follow-settings-command.handler';
import { CreateCommentCommandHandler } from '@/domain/Comment/commands/create-comment/create-comment-command.handler';
import { DeleteCommentCommandHandler } from '@/domain/Comment/commands/delete-comment/delete-comment-command.handler';

export interface ICommandBusSetup {
  noteRepository: INoteRepository;
  userRepository: IUserRepository;
  referenceRepository: IReferenceRepository;
  referenceTypeRepository: IReferenceTypeRepository;
  followRepository: IFollowRepository;
  commentRepository: ICommentRepository;
  followEventPublisher: IFollowEventPublisher;
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
  commandBus.registerHandler('UpdateUserCommand', new UpdateUserCommandHandler(setup.userRepository));
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
  commandBus.registerHandler(
    'FollowUserCommand',
    new FollowUserCommandHandler(
      setup.followRepository,
      setup.userRepository,
      setup.followEventPublisher,
    ),
  );
  commandBus.registerHandler(
    'UnfollowUserCommand',
    new UnfollowUserCommandHandler(setup.followRepository, setup.followEventPublisher),
  );
  commandBus.registerHandler(
    'AcceptFollowRequestCommand',
    new AcceptFollowRequestCommandHandler(setup.followRepository, setup.followEventPublisher),
  );
  commandBus.registerHandler(
    'DeclineFollowRequestCommand',
    new DeclineFollowRequestCommandHandler(setup.followRepository, setup.followEventPublisher),
  );
  commandBus.registerHandler(
    'RemoveFollowerCommand',
    new RemoveFollowerCommandHandler(setup.followRepository, setup.followEventPublisher),
  );
  commandBus.registerHandler(
    'UpdateFollowSettingsCommand',
    new UpdateFollowSettingsCommandHandler(setup.userRepository, setup.followEventPublisher),
  );
  commandBus.registerHandler(
    'CreateCommentCommand',
    new CreateCommentCommandHandler(
      setup.commentRepository,
      setup.noteRepository,
      setup.userRepository,
      setup.followRepository,
    ),
  );
  commandBus.registerHandler(
    'DeleteCommentCommand',
    new DeleteCommentCommandHandler(setup.commentRepository, setup.noteRepository),
  );

  return commandBus;
}
