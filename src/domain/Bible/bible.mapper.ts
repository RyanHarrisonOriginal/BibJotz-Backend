import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import {
  IBiblePassage,
  IBookInfo,
  IBookSummary,
  IChapterInfo,
  ITranslation,
} from '@/domain/Bible/bible-repository.interface';
import {
  IBookInfoResponseDTO,
  IBookSummaryResponseDTO,
  IChapterInfoResponseDTO,
  IPassageResponseDTO,
  ITranslationResponseDTO,
} from '@/domain/Bible/bible.dto';

type RawBook = {
  name: string;
  shortName: string | null;
  testament: string | null;
  chapters?: unknown[];
};

type RawTranslation = {
  code: string;
  name: string;
  license: string | null;
  language: string | null;
};

type RawPassageBook = {
  name: string;
  shortName: string | null;
  chapters?: Array<{
    chapterNumber: number;
    verses?: Array<{
      verseNumber: number;
      bibleTexts?: Array<{
        text: string;
        translation: RawTranslation;
      }>;
    }>;
  }>;
};

export class BibleMapper {
  static mapBooksToInternal(books: unknown[]): IBookSummary[] {
    return (books as RawBook[]).map((b) => ({
      book: b.name,
      bookShortName: b.shortName ?? b.name,
      numberOfChapters: b.chapters?.length ?? 0,
      testament: b.testament ?? null,
    }));
  }

  static mapBookInfoToInternal(books: unknown[]): IBookInfo {
    const book = (books as RawBook[])[0];
    if (!book) throw new NotFoundError('Book not found');
    return {
      book: book.name,
      bookShortName: book.shortName ?? book.name,
      numberOfChapters: book.chapters?.length ?? 0,
    };
  }

  static mapChapterInfoToInternal(books: unknown[]): IChapterInfo {
    const book = (books as RawPassageBook[])[0];
    const chapter = book?.chapters?.[0];
    if (!book || !chapter) throw new NotFoundError('Chapter not found');
    return {
      book: book.name,
      chapter: chapter.chapterNumber,
      numberOfVerses: chapter.verses?.length ?? 0,
    };
  }

  static mapPassageToInternal(bookResult: unknown): IBiblePassage {
    const book = bookResult as RawPassageBook | null;
    const chapter = book?.chapters?.[0];
    if (!book || !chapter) throw new NotFoundError('Passage not found');

    const translationMap: Record<string, ITranslation> = {};
    (chapter.verses ?? []).forEach((v) => {
      (v.bibleTexts ?? []).forEach((bt) => {
        const t = bt.translation;
        if (t && !translationMap[t.code]) {
          translationMap[t.code] = {
            code: t.code,
            name: t.name,
            license: t.license,
            language: t.language,
          };
        }
      });
    });

    return {
      book: book.name,
      bookShortName: book.shortName ?? book.name,
      chapter: chapter.chapterNumber,
      translations: Object.values(translationMap),
      verses: (chapter.verses ?? []).map((v) => ({
        verse: v.verseNumber,
        texts: (v.bibleTexts ?? []).map((bt) => ({
          translation: bt.translation.code,
          text: bt.text,
        })),
      })),
    };
  }

  static mapTranslationsToInternal(translations: unknown[]): ITranslation[] {
    return (translations as RawTranslation[]).map((t) => ({
      code: t.code,
      name: t.name,
      license: t.license,
      language: t.language,
    }));
  }

  static mapBooksToResponseDTO(books: IBookSummary[]): IBookSummaryResponseDTO[] {
    return books.map((b) => ({
      book: b.book,
      bookShortName: b.bookShortName,
      numberOfChapters: b.numberOfChapters,
      testament: b.testament,
    }));
  }

  static mapBookInfoToResponseDTO(info: IBookInfo): IBookInfoResponseDTO {
    return {
      book: info.book,
      bookShortName: info.bookShortName,
      numberOfChapters: info.numberOfChapters,
    };
  }

  static mapChapterInfoToResponseDTO(info: IChapterInfo): IChapterInfoResponseDTO {
    return {
      book: info.book,
      chapter: info.chapter,
      numberOfVerses: info.numberOfVerses,
    };
  }

  static mapPassageToResponseDTO(passage: IBiblePassage): IPassageResponseDTO {
    return {
      book: passage.book,
      bookShortName: passage.bookShortName,
      chapter: passage.chapter,
      translations: passage.translations,
      verses: passage.verses,
    };
  }

  static mapTranslationsToResponseDTO(translations: ITranslation[]): ITranslationResponseDTO[] {
    return translations.map((t) => ({
      code: t.code,
      name: t.name,
      license: t.license,
      language: t.language,
    }));
  }
}
