import { PrismaClient } from '@/generated/app-client';
import { UserFollow } from '@/domain/Follow/user-follow';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';

const userSelect = {
  id: true,
  displayName: true,
  username: true,
} as const;

export class FollowPostgresRepository implements IFollowRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(follow: UserFollow): Promise<unknown> {
    return this.prisma.userFollow.create({
      data: {
        followerId: follow.getFollowerId(),
        followingId: follow.getFollowingId(),
      },
    });
  }

  async findByPair(followerId: number, followingId: number): Promise<unknown | null> {
    return this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
  }

  async deleteByPair(followerId: number, followingId: number): Promise<void> {
    await this.prisma.userFollow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
  }

  async findFollowers(userId: number): Promise<unknown[]> {
    return this.prisma.userFollow.findMany({
      where: { followingId: userId },
      include: { follower: { select: userSelect } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFollowing(userId: number): Promise<unknown[]> {
    return this.prisma.userFollow.findMany({
      where: { followerId: userId },
      include: { following: { select: userSelect } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
