import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { User } from '@/domain/User/user';
import { UserMapper } from '@/domain/User/user.mapper';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { GetCurrentUserQuery } from './get-current-user.query';

export interface ICurrentUser {
  user: User;
  pendingRequestCount: number;
}

export class GetCurrentUserQueryHandler implements IQueryHandler<GetCurrentUserQuery, ICurrentUser> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly followRepository: IFollowRepository,
  ) {}

  async execute(query: GetCurrentUserQuery): Promise<ICurrentUser> {
    const row = await this.userRepository.findById(query.userId);
    if (!row) throw new NotFoundError('User not found');
    const pendingRequestCount = await this.followRepository.countPendingRequests(query.userId);
    return {
      user: UserMapper.mapUserToDomain(row),
      pendingRequestCount,
    };
  }
}
