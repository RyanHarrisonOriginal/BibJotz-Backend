import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { IFollowRequestListDTO } from '@/domain/Follow/follow.dto';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { ListFollowRequestsQuery } from './list-follow-requests.query';

type RawRequest = {
  id: number;
  followerId: number;
  createdAt: Date;
  follower?: {
    id: number;
    displayName: string;
    username: string | null;
  };
};

export class ListFollowRequestsQueryHandler
  implements IQueryHandler<ListFollowRequestsQuery, IFollowRequestListDTO>
{
  constructor(private readonly followRepository: IFollowRepository) {}

  async execute(query: ListFollowRequestsQuery): Promise<IFollowRequestListDTO> {
    const cursor =
      query.cursorCreatedAt && query.cursorId
        ? { createdAt: query.cursorCreatedAt, id: query.cursorId }
        : undefined;
    const rows = (await this.followRepository.findIncomingPending(query.userId, {
      limit: query.limit + 1,
      cursor,
    })) as RawRequest[];

    const page = rows.slice(0, query.limit);
    const hasMore = rows.length > query.limit;
    const last = page[page.length - 1];

    return {
      requests: page.flatMap((row) => {
        if (!row.follower) return [];
        return [
          {
            id: row.id,
            followerId: row.follower.id,
            displayName: row.follower.displayName,
            username: row.follower.username,
            status: 'PENDING' as const,
            createdAt: row.createdAt.toISOString(),
          },
        ];
      }),
      nextCursor:
        hasMore && last
          ? { createdAt: last.createdAt.toISOString(), id: last.id }
          : null,
    };
  }
}
