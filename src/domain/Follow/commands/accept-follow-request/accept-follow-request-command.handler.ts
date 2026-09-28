import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { UserFollow } from '@/domain/Follow/user-follow';
import { FollowMapper } from '@/domain/Follow/follow.mapper';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { IFollowEventPublisher } from '@/domain/Follow/ports/follow-event-publisher.port';
import { AcceptFollowRequestCommand } from './accept-follow-request.command';

export class AcceptFollowRequestCommandHandler
  implements ICommandHandler<AcceptFollowRequestCommand, UserFollow>
{
  constructor(
    private readonly followRepository: IFollowRepository,
    private readonly events: IFollowEventPublisher,
  ) {}

  async execute(command: AcceptFollowRequestCommand): Promise<UserFollow> {
    const existing = await this.followRepository.findByPair(command.followerId, command.followeeId);
    if (!existing) throw new NotFoundError('Follow request not found');

    const follow = FollowMapper.mapFollowToDomain(existing);
    if (follow.getStatus() === 'ACCEPTED') return follow;

    follow.accept();
    const saved = FollowMapper.mapFollowToDomain(await this.followRepository.save(follow));
    await this.events.publish({
      type: 'FollowAccepted',
      followerId: command.followerId,
      followeeId: command.followeeId,
    });
    return saved;
  }
}
