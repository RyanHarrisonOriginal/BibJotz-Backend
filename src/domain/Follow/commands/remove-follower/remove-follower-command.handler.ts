import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { FollowMapper } from '@/domain/Follow/follow.mapper';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { IFollowEventPublisher } from '@/domain/Follow/ports/follow-event-publisher.port';
import { RemoveFollowerCommand } from './remove-follower.command';

export class RemoveFollowerCommandHandler implements ICommandHandler<RemoveFollowerCommand, void> {
  constructor(
    private readonly followRepository: IFollowRepository,
    private readonly events: IFollowEventPublisher,
  ) {}

  async execute(command: RemoveFollowerCommand): Promise<void> {
    const existing = await this.followRepository.findByPair(command.followerId, command.followeeId);
    if (!existing) return;

    const follow = FollowMapper.mapFollowToDomain(existing);
    if (follow.getStatus() !== 'ACCEPTED') return;

    await this.followRepository.deleteByPair(command.followerId, command.followeeId);
    await this.events.publish({
      type: 'FollowRemoved',
      followerId: command.followerId,
      followeeId: command.followeeId,
      reason: 'remove-follower',
    });
  }
}
