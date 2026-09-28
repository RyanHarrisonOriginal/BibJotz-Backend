import { PrismaClient, Prisma } from '@/generated/app-client';
import { UserFollow } from '@/domain/Follow/user-follow';
import { IFollowRepository, IFollowRequestCursor } from '@/domain/Follow/follow-repository.interface';

const userSelect = {
  id: true,
  displayName: true,
  username: true,
} as const;

export class FollowPostgresRepository implements IFollowRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(follow: UserFollow): Promise<unknown> {
    const id = follow.getId();
    if (!id) {
      return this.prisma.userFollow.create({
        data: {
          followerId: follow.getFollowerId(),
          followingId: follow.getFollowingId(),
          status: follow.getStatus(),
        },
      });
    }

    return this.prisma.userFollow.update({
      where: { id },
      data: { status: follow.getStatus() },
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
      where: { followingId: userId, status: 'ACCEPTED' },
      include: { follower: { select: userSelect } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFollowing(userId: number): Promise<unknown[]> {
    return this.prisma.userFollow.findMany({
      where: { followerId: userId, status: 'ACCEPTED' },
      include: { following: { select: userSelect } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countAcceptedFollowers(userId: number): Promise<number> {
    return this.prisma.userFollow.count({
      where: { followingId: userId, status: 'ACCEPTED' },
    });
  }

  async countAcceptedFollowing(userId: number): Promise<number> {
    return this.prisma.userFollow.count({
      where: { followerId: userId, status: 'ACCEPTED' },
    });
  }

  async countPendingRequests(followeeId: number): Promise<number> {
    return this.prisma.userFollow.count({
      where: { followingId: followeeId, status: 'PENDING' },
    });
  }

  async findIncomingPending(
    followeeId: number,
    options: { limit: number; cursor?: IFollowRequestCursor },
  ): Promise<unknown[]> {
    const cursor = options.cursor;
    const where: Prisma.UserFollowWhereInput = {
      followingId: followeeId,
      status: 'PENDING',
      ...(cursor
        ? {
            OR: [
              { createdAt: { lt: cursor.createdAt } },
              { createdAt: cursor.createdAt, id: { lt: cursor.id } },
            ],
          }
        : {}),
    };

    return this.prisma.userFollow.findMany({
      where,
      include: { follower: { select: userSelect } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: options.limit,
    });
  }
}
