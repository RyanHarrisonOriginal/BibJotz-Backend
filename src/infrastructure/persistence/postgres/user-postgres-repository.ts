import { PrismaClient } from '@/generated/app-client';
import { User } from '@/domain/User/user';
import { ISavedFollowSettings, IUserRepository, IUserSearchFilters } from '@/domain/User/user-repository.interface';
import { UserMapper } from '@/domain/User/user.mapper';

export class UserPostgresRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<unknown> {
    const data = UserMapper.mapUserToPersistence(user);
    const id = data.id as number | null;
    const payload = {
      displayName: data.displayName as string,
      clerkUserId: (data.clerkUserId as string | null) ?? null,
      username: (data.username as string | null) ?? null,
      bio: (data.bio as string | null) ?? null,
      followPolicy: (data.followPolicy as 'OPEN' | 'APPROVAL') ?? 'APPROVAL',
      followListsPublic: Boolean(data.followListsPublic),
    };

    if (!id) {
      return this.prisma.user.create({ data: payload });
    }

    return this.prisma.user.update({
      where: { id },
      data: payload,
    });
  }

  async findById(id: number): Promise<unknown | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByClerkUserId(clerkUserId: string): Promise<unknown | null> {
    return this.prisma.user.findUnique({ where: { clerkUserId } });
  }

  async search(filters: IUserSearchFilters): Promise<unknown[]> {
    const q = filters.query.trim();
    if (!q) return [];

    return this.prisma.user.findMany({
      where: {
        OR: [
          { displayName: { contains: q, mode: 'insensitive' } },
          { username: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { displayName: 'asc' },
      take: filters.limit,
    });
  }

  async saveFollowSettings(user: User, acceptPendingRequests: boolean): Promise<ISavedFollowSettings> {
    const id = user.getId();
    if (!id) throw new Error('User id is required to save follow settings');

    return this.prisma.$transaction(async (tx) => {
      let acceptedFollowerIds: number[] = [];
      if (acceptPendingRequests) {
        const pending = await tx.userFollow.findMany({
          where: { followingId: id, status: 'PENDING' },
          select: { followerId: true },
        });
        acceptedFollowerIds = pending.map((row) => row.followerId);
        if (acceptedFollowerIds.length > 0) {
          await tx.userFollow.updateMany({
            where: { followingId: id, status: 'PENDING' },
            data: { status: 'ACCEPTED' },
          });
        }
      }

      const raw = await tx.user.update({
        where: { id },
        data: {
          followPolicy: user.getFollowPolicy(),
          followListsPublic: user.getFollowListsPublic(),
        },
      });

      return { raw, acceptedFollowerIds };
    });
  }
}
