import { UserFollow } from '@/domain/Follow/user-follow';

export interface IFollowRequestCursor {
  createdAt: Date;
  id: number;
}

export interface IFollowRepository {
  save(follow: UserFollow): Promise<unknown>;
  findByPair(followerId: number, followingId: number): Promise<unknown | null>;
  deleteByPair(followerId: number, followingId: number): Promise<void>;
  findFollowers(userId: number): Promise<unknown[]>;
  findFollowing(userId: number): Promise<unknown[]>;
  countAcceptedFollowers(userId: number): Promise<number>;
  countAcceptedFollowing(userId: number): Promise<number>;
  countPendingRequests(followeeId: number): Promise<number>;
  findIncomingPending(
    followeeId: number,
    options: { limit: number; cursor?: IFollowRequestCursor },
  ): Promise<unknown[]>;
}
