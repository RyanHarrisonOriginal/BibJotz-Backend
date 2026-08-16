import { PrismaClient } from '@/generated/bible-client';
import { IBibleRepository, IBiblePassageFilters } from '@/domain/Bible/bible-repository.interface';

export class BiblePostgresRepository implements IBibleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private verseFilter(startVerse?: number, endVerse?: number) {
    const filter: Record<string, number> = {};
    if (startVerse != null && !Number.isNaN(startVerse)) filter.gte = startVerse;
    if (endVerse != null && !Number.isNaN(endVerse)) filter.lte = endVerse;
    return Object.keys(filter).length > 0 ? { verseNumber: filter } : undefined;
  }

  private translationFilter(translationCode?: string) {
    return translationCode
      ? {
          translation: {
            code: {
              equals: translationCode,
              mode: 'insensitive' as const,
            },
          },
        }
      : undefined;
  }

  private bookNameFilter(bookName: string) {
    return {
      OR: [
        { name: { equals: bookName, mode: 'insensitive' as const } },
        { shortName: { equals: bookName, mode: 'insensitive' as const } },
      ],
    };
  }

  async findAllBooks(translationCode?: string): Promise<unknown[]> {
    return this.prisma.book.findMany({
      where: {
        chapters: {
          some: {
            verses: {
              some: {
                bibleTexts: {
                  some: {
                    ...this.translationFilter(translationCode),
                  },
                },
              },
            },
          },
        },
      },
      include: { chapters: true },
      orderBy: { id: 'asc' },
    });
  }

  async findBookInfo(bookName: string): Promise<unknown[]> {
    return this.prisma.book.findMany({
      where: this.bookNameFilter(bookName),
      include: { chapters: true },
    });
  }

  async findChapterInfo(bookName: string, chapterNumber: number): Promise<unknown[]> {
    return this.prisma.book.findMany({
      where: {
        ...this.bookNameFilter(bookName),
        chapters: { some: { chapterNumber } },
      },
      include: {
        chapters: {
          where: { chapterNumber },
          include: { verses: true },
        },
      },
    });
  }

  async findVerseText(filters: IBiblePassageFilters): Promise<unknown | null> {
    return this.prisma.book.findFirst({
      where: this.bookNameFilter(filters.bookName),
      include: {
        chapters: {
          where: { chapterNumber: filters.chapterNumber },
          include: {
            verses: {
              where: this.verseFilter(filters.startVerse, filters.endVerse),
              include: {
                bibleTexts: {
                  where: this.translationFilter(filters.translationCode),
                  include: { translation: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async findAllTranslations(): Promise<unknown[]> {
    return this.prisma.translation.findMany({
      orderBy: { code: 'asc' },
    });
  }
}
