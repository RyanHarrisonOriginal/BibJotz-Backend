import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { User } from '@/domain/User/user';
import { UserMapper } from '@/domain/User/user.mapper';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { IFollowEventPublisher } from '@/domain/Follow/ports/follow-event-publisher.port';
import { UpdateFollowSettingsCommand } from './update-follow-settings.command';

export class UpdateFollowSettingsCommandHandler
  implements ICommandHandler<UpdateFollowSettingsCommand, User>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly events: IFollowEventPublisher,
  ) {}

  async execute(command: UpdateFollowSettingsCommand): Promise<User> {
    const row = await this.userRepository.findById(command.userId);
    if (!row) throw new NotFoundError('User not found');

    const user = UserMapper.mapUserToDomain(row);
    const { policyChanged, previousPolicy } = user.changeFollowSettings({
      followPolicy: command.followPolicy,
      followListsPublic: command.followListsPublic,
    });
    const acceptPending = policyChanged && previousPolicy === 'APPROVAL' && user.getFollowPolicy() === 'OPEN';
    const saved = await this.userRepository.saveFollowSettings(user, acceptPending);
    const updated = UserMapper.mapUserToDomain(saved.raw);

    if (policyChanged) {
      await this.events.publish({
        type: 'FollowPolicyChanged',
        userId: command.userId,
        previousPolicy,
        followPolicy: updated.getFollowPolicy(),
      });
    }
    for (const followerId of saved.acceptedFollowerIds) {
      await this.events.publish({
        type: 'FollowAccepted',
        followerId,
        followeeId: command.userId,
      });
    }

    return updated;
  }
}
