import { Prisma, PrismaClient } from '@/generated/app-client';
import { Note } from '@/domain/Note/note';
import { INoteListFilters, INoteRepository } from '@/domain/Note/note-repository.interface';
import { NoteMapper } from '@/domain/Note/note.mapper';

export class NotePostgresRepository implements INoteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(note: Note): Promise<unknown> {
    const data = NoteMapper.mapNoteToPersistence(note);
    const id = data.id as number | null;
    const payload = {
      userId: data.userId as number,
      content: data.content as string,
      bookName: data.bookName as string,
      bookShortName: data.bookShortName as string,
      chapter: (data.chapter as number | null) ?? null,
      startVerse: (data.startVerse as number | null) ?? null,
      endVerse: (data.endVerse as number | null) ?? null,
      scope: data.scope as 'BOOK' | 'CHAPTER' | 'VERSE' | 'VERSE_RANGE',
    };

    if (!id) {
      return this.prisma.note.create({ data: payload });
    }

    return this.prisma.note.update({
      where: { id },
      data: payload,
    });
  }

  async findById(id: number): Promise<unknown | null> {
    return this.prisma.note.findUnique({ where: { id } });
  }

  async findMany(filters: INoteListFilters): Promise<unknown[]> {
    const where: Prisma.NoteWhereInput = { userId: filters.userId };

    if (filters.scope) {
      where.scope = filters.scope;
    }

    if (filters.bookName) {
      where.bookName = { equals: filters.bookName, mode: 'insensitive' };
      if (filters.chapter != null) {
        where.OR = [{ scope: 'BOOK' }, { chapter: filters.chapter }];
      }
    }

    return this.prisma.note.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.note.delete({ where: { id } });
  }
}
