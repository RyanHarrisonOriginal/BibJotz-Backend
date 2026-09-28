import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { FollowMapper } from '@/domain/Follow/follow.mapper';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { IFollowEventPublisher } from '@/domain/Follow/ports/follow-event-publisher.port';
import { UnfollowUserCommand } from './unfollow-user.command';

export class UnfollowUserCommandHandler implements ICommandHandler<UnfollowUserCommand, void> {
  constructor(
    private readonly followRepository: IFollowRepository,
    private readonly events: IFollowEventPublisher,
  ) {}

  async execute(command: UnfollowUserCommand): Promise<void> {
    const existing = await this.followRepository.findByPair(command.followerId, command.followingId);
    if (!existing) return;

    const follow = FollowMapper.mapFollowToDomain(existing);
    await this.followRepository.deleteByPair(command.followerId, command.followingId);
    await this.events.publish({
      type: 'FollowRemoved',
      followerId: command.followerId,
      followeeId: command.followingId,
      reason: follow.getStatus() === 'PENDING' ? 'cancel' : 'unfollow',
    });
  }
}
