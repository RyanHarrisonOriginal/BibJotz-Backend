import { Prisma, PrismaClient } from '@/generated/app-client';
import { Reference } from '@/domain/Reference/reference';
import { IReferenceListFilters, IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { ReferenceMapper } from '@/domain/Reference/reference.mapper';

const referenceInclude = {
  type: true,
} satisfies Prisma.ReferenceInclude;

export class ReferencePostgresRepository implements IReferenceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(reference: Reference): Promise<unknown> {
    const data = ReferenceMapper.mapReferenceToPersistence(reference);
    const id = data.id as number | null;
    const payload = {
      userId: data.userId as number,
      typeId: data.typeId as number,
      title: data.title as string,
      normalizedTitle: data.normalizedTitle as string,
      author: (data.author as string | null) ?? null,
    };

    if (!id) {
      return this.prisma.reference.create({
        data: payload,
        include: referenceInclude,
      });
    }

    return this.prisma.reference.update({
      where: { id },
      data: payload,
      include: referenceInclude,
    });
  }

  async findById(id: number): Promise<unknown | null> {
    return this.prisma.reference.findUnique({
      where: { id },
      include: referenceInclude,
    });
  }

  async findByUserTypeAndNormalizedTitle(
    userId: number,
    typeId: number,
    normalizedTitle: string,
  ): Promise<unknown | null> {
    return this.prisma.reference.findUnique({
      where: {
        userId_typeId_normalizedTitle: { userId, typeId, normalizedTitle },
      },
      include: referenceInclude,
    });
  }

  async findMany(filters: IReferenceListFilters): Promise<unknown[]> {
    return this.prisma.reference.findMany({
      where: {
        userId: filters.userId,
        ...(filters.typeId != null ? { typeId: filters.typeId } : {}),
      },
      include: referenceInclude,
      orderBy: [{ title: 'asc' }],
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.reference.delete({ where: { id } });
  }
}
