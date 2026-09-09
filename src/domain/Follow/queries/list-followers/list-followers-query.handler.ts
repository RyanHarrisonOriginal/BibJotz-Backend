import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { FollowMapper } from '@/domain/Follow/follow.mapper';
import { IFollowUserSummaryDTO } from '@/domain/Follow/follow.dto';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { ListFollowersQuery } from './list-followers.query';

export class ListFollowersQueryHandler
  implements IQueryHandler<ListFollowersQuery, IFollowUserSummaryDTO[]>
{
  constructor(private readonly followRepository: IFollowRepository) {}

  async execute(query: ListFollowersQuery): Promise<IFollowUserSummaryDTO[]> {
    const rows = await this.followRepository.findFollowers(query.userId);
    return FollowMapper.mapFollowersToSummaryDTO(rows);
  }
}
