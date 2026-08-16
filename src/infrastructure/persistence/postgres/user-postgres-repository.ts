import { PrismaClient } from '@/generated/app-client';
import { User } from '@/domain/User/user';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { UserMapper } from '@/domain/User/user.mapper';

export class UserPostgresRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<unknown> {
    const data = UserMapper.mapUserToPersistence(user);
    const id = data.id as number | null;
    const payload = { displayName: data.displayName as string };

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
}
