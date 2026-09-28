import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { FollowMapper } from '@/domain/Follow/follow.mapper';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { IFollowEventPublisher } from '@/domain/Follow/ports/follow-event-publisher.port';
import { DeclineFollowRequestCommand } from './decline-follow-request.command';

export class DeclineFollowRequestCommandHandler
  implements ICommandHandler<DeclineFollowRequestCommand, void>
{
  constructor(
    private readonly followRepository: IFollowRepository,
    private readonly events: IFollowEventPublisher,
  ) {}

  async execute(command: DeclineFollowRequestCommand): Promise<void> {
    const existing = await this.followRepository.findByPair(command.followerId, command.followeeId);
    if (!existing) throw new NotFoundError('Follow request not found');

    const follow = FollowMapper.mapFollowToDomain(existing);
    if (follow.getStatus() !== 'PENDING') throw new NotFoundError('Follow request not found');

    await this.followRepository.deleteByPair(command.followerId, command.followeeId);
    await this.events.publish({
      type: 'FollowRemoved',
      followerId: command.followerId,
      followeeId: command.followeeId,
      reason: 'decline',
    });
  }
}
