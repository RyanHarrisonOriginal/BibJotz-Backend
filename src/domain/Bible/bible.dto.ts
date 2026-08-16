/** Request and response shapes at the HTTP boundary only. No parsing or mapping here. */

export interface IGetBooksQueryParamsDTO {
  translation?: string | string[];
}

export interface IGetBookInfoParamsDTO {
  bookName?: string;
}

export interface IGetChapterInfoParamsDTO {
  bookName?: string;
  chapterNumber?: string;
}

export interface IGetPassageParamsDTO {
  bookName?: string;
  chapterNumber?: string;
  start?: string | string[];
  end?: string | string[];
  translation?: string | string[];
}

export interface IBookSummaryResponseDTO {
  book: string;
  bookShortName: string;
  numberOfChapters: number;
  testament: string | null;
}

export interface IBookInfoResponseDTO {
  book: string;
  bookShortName: string;
  numberOfChapters: number;
}

export interface IChapterInfoResponseDTO {
  book: string;
  chapter: number;
  numberOfVerses: number;
}

export interface ITranslationResponseDTO {
  code: string;
  name: string;
  license: string | null;
  language: string | null;
}

export interface IVerseTextResponseDTO {
  translation: string;
  text: string;
}

export interface IVerseResponseDTO {
  verse: number;
  texts: IVerseTextResponseDTO[];
}

export interface IPassageResponseDTO {
  book: string;
  bookShortName: string;
  chapter: number;
  translations: ITranslationResponseDTO[];
  verses: IVerseResponseDTO[];
}
