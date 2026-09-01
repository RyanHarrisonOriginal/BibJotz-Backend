import { PrismaClient } from '@/generated/app-client';
import { ReferenceType } from '@/domain/Reference/reference-type';
import { IReferenceTypeRepository } from '@/domain/Reference/reference-type-repository.interface';
import { ReferenceTypeMapper } from '@/domain/Reference/reference-type.mapper';

export class ReferenceTypePostgresRepository implements IReferenceTypeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(type: ReferenceType): Promise<unknown> {
    const data = ReferenceTypeMapper.mapReferenceTypeToPersistence(type);
    const id = data.id as number | null;
    const payload = {
      userId: data.userId as number,
      name: data.name as string,
      normalizedName: data.normalizedName as string,
    };

    if (!id) {
      return this.prisma.referenceType.create({ data: payload });
    }

    return this.prisma.referenceType.update({
      where: { id },
      data: payload,
    });
  }

  async findById(id: number): Promise<unknown | null> {
    return this.prisma.referenceType.findUnique({ where: { id } });
  }

  async findByUserIdAndNormalizedName(userId: number, normalizedName: string): Promise<unknown | null> {
    return this.prisma.referenceType.findUnique({
      where: {
        userId_normalizedName: { userId, normalizedName },
      },
    });
  }

  async findManyByUserId(userId: number): Promise<unknown[]> {
    return this.prisma.referenceType.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async countReferences(typeId: number): Promise<number> {
    return this.prisma.reference.count({ where: { typeId } });
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.referenceType.delete({ where: { id } });
  }
}
