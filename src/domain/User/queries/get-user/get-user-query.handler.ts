import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { User } from '@/domain/User/user';
import { UserMapper } from '@/domain/User/user.mapper';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { ViewerFollowStatus } from '@/domain/User/user.dto';
import { GetUserQuery } from './get-user.query';

export interface IUserProfile {
  user: User;
  followerCount: number;
  followingCount: number;
  viewerFollowStatus: ViewerFollowStatus;
}

function viewerFollowStatusFrom(row: unknown): ViewerFollowStatus {
  if (row == null || typeof row !== 'object') return 'NONE';
  const status = (row as { status?: string }).status;
  if (status === 'PENDING' || status === 'ACCEPTED') return status;
  return 'NONE';
}

export class GetUserQueryHandler implements IQueryHandler<GetUserQuery, IUserProfile> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly followRepository: IFollowRepository,
  ) {}

  async execute(query: GetUserQuery): Promise<IUserProfile> {
    const row = await this.userRepository.findById(query.id);
    if (!row) throw new NotFoundError('User not found');

    const [followerCount, followingCount, follow] = await Promise.all([
      this.followRepository.countAcceptedFollowers(query.id),
      this.followRepository.countAcceptedFollowing(query.id),
      query.viewerUserId === query.id
        ? Promise.resolve(null)
        : this.followRepository.findByPair(query.viewerUserId, query.id),
    ]);

    return {
      user: UserMapper.mapUserToDomain(row),
      followerCount,
      followingCount,
      viewerFollowStatus: viewerFollowStatusFrom(follow),
    };
  }
}
