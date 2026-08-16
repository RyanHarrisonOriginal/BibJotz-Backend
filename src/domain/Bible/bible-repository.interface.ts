export interface IBookSummary {
  book: string;
  bookShortName: string;
  numberOfChapters: number;
  testament: string | null;
}

export interface IBookInfo {
  book: string;
  bookShortName: string;
  numberOfChapters: number;
}

export interface IChapterInfo {
  book: string;
  chapter: number;
  numberOfVerses: number;
}

export interface ITranslation {
  code: string;
  name: string;
  license: string | null;
  language: string | null;
}

export interface IVerseText {
  translation: string;
  text: string;
}

export interface IVerse {
  verse: number;
  texts: IVerseText[];
}

export interface IBiblePassage {
  book: string;
  bookShortName: string;
  chapter: number;
  translations: ITranslation[];
  verses: IVerse[];
}

export interface IBibleListFilters {
  translationCode?: string;
}

export interface IBiblePassageFilters {
  bookName: string;
  chapterNumber: number;
  startVerse?: number;
  endVerse?: number;
  translationCode?: string;
}

/**
 * Port: bible corpus reads. Implemented by a Postgres adapter.
 * Returns raw persistence shapes only.
 */
export interface IBibleRepository {
  findAllBooks(translationCode?: string): Promise<unknown[]>;
  findBookInfo(bookName: string): Promise<unknown[]>;
  findChapterInfo(bookName: string, chapterNumber: number): Promise<unknown[]>;
  findVerseText(filters: IBiblePassageFilters): Promise<unknown | null>;
  findAllTranslations(): Promise<unknown[]>;
}
