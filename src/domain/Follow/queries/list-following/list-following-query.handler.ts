import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { FollowMapper } from '@/domain/Follow/follow.mapper';
import { IFollowUserSummaryDTO } from '@/domain/Follow/follow.dto';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { ListFollowingQuery } from './list-following.query';

export class ListFollowingQueryHandler
  implements IQueryHandler<ListFollowingQuery, IFollowUserSummaryDTO[]>
{
  constructor(private readonly followRepository: IFollowRepository) {}

  async execute(query: ListFollowingQuery): Promise<IFollowUserSummaryDTO[]> {
    const rows = await this.followRepository.findFollowing(query.userId);
    return FollowMapper.mapFollowingToSummaryDTO(rows);
  }
}
