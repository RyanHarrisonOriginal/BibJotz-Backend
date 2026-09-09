import { UserFollow } from '@/domain/Follow/user-follow';

export interface IFollowRepository {
  save(follow: UserFollow): Promise<unknown>;
  findByPair(followerId: number, followingId: number): Promise<unknown | null>;
  deleteByPair(followerId: number, followingId: number): Promise<void>;
  findFollowers(userId: number): Promise<unknown[]>;
  findFollowing(userId: number): Promise<unknown[]>;
}
