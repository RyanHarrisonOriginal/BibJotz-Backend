import { Prisma, PrismaClient } from '@/generated/app-client';
import { Note } from '@/domain/Note/note';
import {
  IFeedNotesFilters,
  INoteListFilters,
  INoteRepository,
  INoteSearchFilters,
  IProfileNotesFilters,
} from '@/domain/Note/note-repository.interface';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { visibleNoteWhere } from '@/infrastructure/persistence/postgres/visible-note-where';

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

const noteWithAuthorInclude = {
  ...noteInclude,
  user: {
    select: {
      id: true,
      displayName: true,
      username: true,
    },
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
      audience: data.audience as 'PRIVATE' | 'FOLLOWERS' | 'PUBLIC',
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

  async findManyByReferenceId(referenceId: number): Promise<unknown[]> {
    return this.prisma.note.findMany({
      where: {
        references: { some: { referenceId } },
      },
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

  async findVisibleProfileNotes(filters: IProfileNotesFilters): Promise<unknown[]> {
    return this.prisma.note.findMany({
      where: {
        AND: [{ userId: filters.authorUserId }, visibleNoteWhere(filters.viewerUserId)],
      },
      include: noteWithAuthorInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFeedForUser(filters: IFeedNotesFilters): Promise<unknown[]> {
    const limit = Math.min(Math.max(filters.limit ?? 50, 1), 100);

    return this.prisma.note.findMany({
      where: {
        AND: [
          { NOT: { userId: filters.viewerUserId } },
          {
            user: {
              followers: {
                some: { followerId: filters.viewerUserId, status: 'ACCEPTED' },
              },
            },
          },
          visibleNoteWhere(filters.viewerUserId),
        ],
      },
      include: noteWithAuthorInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async searchVisible(filters: INoteSearchFilters): Promise<unknown[]> {
    const q = filters.query.trim();
    if (!q) return [];

    return this.prisma.note.findMany({
      where: {
        AND: [
          visibleNoteWhere(filters.viewerUserId),
          {
            OR: [
              { content: { contains: q, mode: 'insensitive' } },
              { bookName: { contains: q, mode: 'insensitive' } },
              { bookShortName: { contains: q, mode: 'insensitive' } },
            ],
          },
        ],
      },
      include: noteWithAuthorInclude,
      orderBy: { createdAt: 'desc' },
      take: filters.limit,
    });
  }

  async findDistinctCreatedDays(userId: number, timeZone: string): Promise<string[]> {
    // created_at is TIMESTAMP WITHOUT TIME ZONE storing UTC wall-clock (Prisma DateTime).
    // Interpret as UTC, then convert to the caller's calendar day.
    const rows = await this.prisma.$queryRaw<{ day: Date }[]>`
      SELECT DISTINCT ((created_at AT TIME ZONE 'UTC') AT TIME ZONE ${timeZone})::date AS day
      FROM jotz.notes
      WHERE user_id = ${userId}
      ORDER BY day DESC
    `;

    return rows.map((row) => formatPgDate(row.day));
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.note.delete({ where: { id } });
  }
}

/** PG `date` values arrive as UTC-midnight Date or YYYY-MM-DD string. */
function formatPgDate(value: Date | string): string {
  if (typeof value === 'string') return value.slice(0, 10);
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, '0');
  const day = String(value.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
