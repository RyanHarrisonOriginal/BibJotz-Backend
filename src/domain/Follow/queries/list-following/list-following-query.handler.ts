import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { FollowMapper } from '@/domain/Follow/follow.mapper';
import { IFollowUserSummaryDTO } from '@/domain/Follow/follow.dto';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { UserMapper } from '@/domain/User/user.mapper';
import { followGrantFrom } from '@/domain/Note/can-view-note';
import { assertCanViewFollowLists } from '@/domain/Follow/can-view-follow-lists';
import { ListFollowingQuery } from './list-following.query';

export class ListFollowingQueryHandler
  implements IQueryHandler<ListFollowingQuery, IFollowUserSummaryDTO[]>
{
  constructor(
    private readonly followRepository: IFollowRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: ListFollowingQuery): Promise<IFollowUserSummaryDTO[]> {
    const userRow = await this.userRepository.findById(query.userId);
    if (!userRow) throw new NotFoundError('User not found');
    const user = UserMapper.mapUserToDomain(userRow);
    const follow = await this.followRepository.findByPair(query.viewerUserId, query.userId);
    assertCanViewFollowLists({
      viewerId: query.viewerUserId,
      targetUserId: query.userId,
      followListsPublic: user.getFollowListsPublic(),
      viewerFollowGrant: followGrantFrom(follow),
    });
    const rows = await this.followRepository.findFollowing(query.userId);
    return FollowMapper.mapFollowingToSummaryDTO(rows);
  }
}
