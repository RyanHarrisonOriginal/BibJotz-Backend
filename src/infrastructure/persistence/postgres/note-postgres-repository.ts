import { Prisma, PrismaClient } from '@/generated/app-client';
import { Note } from '@/domain/Note/note';
import { INoteListFilters, INoteRepository } from '@/domain/Note/note-repository.interface';
import { NoteMapper } from '@/domain/Note/note.mapper';

const noteInclude = {
  references: {
    include: {
      reference: {
        include: { type: true },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.NoteInclude;

export class NotePostgresRepository implements INoteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(note: Note): Promise<unknown> {
    const data = NoteMapper.mapNoteToPersistence(note);
    const id = data.id as number | null;
    const taggedReferenceIds = (data.taggedReferenceIds as number[]) ?? [];
    const payload = {
      userId: data.userId as number,
      content: data.content as string,
      bookName: data.bookName as string,
      bookShortName: data.bookShortName as string,
      chapter: (data.chapter as number | null) ?? null,
      startVerse: (data.startVerse as number | null) ?? null,
      endVerse: (data.endVerse as number | null) ?? null,
      verseSpans: data.verseSpans == null ? Prisma.DbNull : (data.verseSpans as Prisma.InputJsonValue),
      scope: data.scope as 'BOOK' | 'CHAPTER' | 'VERSE' | 'VERSE_RANGE' | 'VERSE_SET',
    };

    return this.prisma.$transaction(async (tx) => {
      const saved = id
        ? await tx.note.update({ where: { id }, data: payload })
        : await tx.note.create({ data: payload });

      await tx.noteReference.deleteMany({
        where:
          taggedReferenceIds.length > 0
            ? { noteId: saved.id, referenceId: { notIn: taggedReferenceIds } }
            : { noteId: saved.id },
      });

      if (taggedReferenceIds.length > 0) {
        await tx.noteReference.createMany({
          data: taggedReferenceIds.map((referenceId) => ({
            noteId: saved.id,
            referenceId,
          })),
          skipDuplicates: true,
        });
      }

      return tx.note.findUniqueOrThrow({
        where: { id: saved.id },
        include: noteInclude,
      });
    });
  }

  async findById(id: number): Promise<unknown | null> {
    return this.prisma.note.findUnique({
      where: { id },
      include: noteInclude,
    });
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
      include: noteInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.note.delete({ where: { id } });
  }
}
