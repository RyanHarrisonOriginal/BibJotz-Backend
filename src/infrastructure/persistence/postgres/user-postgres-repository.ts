import { PrismaClient } from '@/generated/app-client';
import { User } from '@/domain/User/user';
import { IUserRepository, IUserSearchFilters } from '@/domain/User/user-repository.interface';
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
}
