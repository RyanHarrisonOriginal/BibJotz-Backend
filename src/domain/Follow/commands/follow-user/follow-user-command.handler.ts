import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { UserFollow } from '@/domain/Follow/user-follow';
import { FollowMapper } from '@/domain/Follow/follow.mapper';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { UserMapper } from '@/domain/User/user.mapper';
import { IFollowEventPublisher } from '@/domain/Follow/ports/follow-event-publisher.port';
import { FollowUserCommand } from './follow-user.command';

export interface IFollowUserResult {
  follow: UserFollow;
  created: boolean;
}

export class FollowUserCommandHandler implements ICommandHandler<FollowUserCommand, IFollowUserResult> {
  constructor(
    private readonly followRepository: IFollowRepository,
    private readonly userRepository: IUserRepository,
    private readonly events: IFollowEventPublisher,
  ) {}

  async execute(command: FollowUserCommand): Promise<IFollowUserResult> {
    const [follower, following] = await Promise.all([
      this.userRepository.findById(command.followerId),
      this.userRepository.findById(command.followingId),
    ]);
    if (!follower) throw new NotFoundError('Follower user not found');
    if (!following) throw new NotFoundError('User to follow not found');

    const existing = await this.followRepository.findByPair(command.followerId, command.followingId);
    if (existing) {
      return { follow: FollowMapper.mapFollowToDomain(existing), created: false };
    }

    const target = UserMapper.mapUserToDomain(following);
    const status = target.getFollowPolicy() === 'OPEN' ? 'ACCEPTED' : 'PENDING';
    const follow = new UserFollow(null, command.followerId, command.followingId, new Date(), status);
    const saved = FollowMapper.mapFollowToDomain(await this.followRepository.save(follow));

    if (status === 'ACCEPTED') {
      await this.events.publish({
        type: 'FollowAccepted',
        followerId: command.followerId,
        followeeId: command.followingId,
      });
    } else {
      await this.events.publish({
        type: 'FollowRequested',
        followerId: command.followerId,
        followeeId: command.followingId,
      });
    }

    return { follow: saved, created: true };
  }
}
