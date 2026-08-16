import { Request, Response } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { BibleMapper } from '@/domain/Bible/bible.mapper';
import {
  IBiblePassage,
  IBookInfo,
  IBookSummary,
  IChapterInfo,
  ITranslation,
} from '@/domain/Bible/bible-repository.interface';
import { GetBooksQuery } from '@/domain/Bible/queries/get-books/get-books.query';
import { GetBookInfoQuery } from '@/domain/Bible/queries/get-book-info/get-book-info.query';
import { GetChapterInfoQuery } from '@/domain/Bible/queries/get-chapter-info/get-chapter-info.query';
import { GetPassageQuery } from '@/domain/Bible/queries/get-passage/get-passage.query';
import { GetTranslationsQuery } from '@/domain/Bible/queries/get-translations/get-translations.query';

export class BibleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  getBooks = async (req: Request, res: Response): Promise<void> => {
    const query = GetBooksQuery.from(req.query);
    const result = await this.queryBus.execute<GetBooksQuery, IBookSummary[]>(query);
    res.json(BibleMapper.mapBooksToResponseDTO(result));
  };

  getBookInfo = async (req: Request, res: Response): Promise<void> => {
    const query = GetBookInfoQuery.from(req.params);
    const result = await this.queryBus.execute<GetBookInfoQuery, IBookInfo>(query);
    res.json(BibleMapper.mapBookInfoToResponseDTO(result));
  };

  getChapterInfo = async (req: Request, res: Response): Promise<void> => {
    const query = GetChapterInfoQuery.from(req.params);
    const result = await this.queryBus.execute<GetChapterInfoQuery, IChapterInfo>(query);
    res.json(BibleMapper.mapChapterInfoToResponseDTO(result));
  };

  getPassage = async (req: Request, res: Response): Promise<void> => {
    const query = GetPassageQuery.from({ ...req.params, ...req.query });
    const result = await this.queryBus.execute<GetPassageQuery, IBiblePassage>(query);
    res.json(BibleMapper.mapPassageToResponseDTO(result));
  };

  getTranslations = async (_req: Request, res: Response): Promise<void> => {
    const query = GetTranslationsQuery.from();
    const result = await this.queryBus.execute<GetTranslationsQuery, ITranslation[]>(query);
    res.json(BibleMapper.mapTranslationsToResponseDTO(result));
  };
}
