import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { IBibleRepository, IBookSummary } from '@/domain/Bible/bible-repository.interface';
import { BibleMapper } from '@/domain/Bible/bible.mapper';
import { GetBooksQuery } from './get-books.query';

export class GetBooksQueryHandler implements IQueryHandler<GetBooksQuery, IBookSummary[]> {
  constructor(private readonly bibleRepository: IBibleRepository) {}

  async execute(query: GetBooksQuery): Promise<IBookSummary[]> {
    const rows = await this.bibleRepository.findAllBooks(query.translationCode);
    return BibleMapper.mapBooksToInternal(rows);
  }
}
