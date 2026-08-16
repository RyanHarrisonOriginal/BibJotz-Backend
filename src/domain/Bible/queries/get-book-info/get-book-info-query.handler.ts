import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { IBibleRepository, IBookInfo } from '@/domain/Bible/bible-repository.interface';
import { BibleMapper } from '@/domain/Bible/bible.mapper';
import { GetBookInfoQuery } from './get-book-info.query';

export class GetBookInfoQueryHandler implements IQueryHandler<GetBookInfoQuery, IBookInfo> {
  constructor(private readonly bibleRepository: IBibleRepository) {}

  async execute(query: GetBookInfoQuery): Promise<IBookInfo> {
    const rows = await this.bibleRepository.findBookInfo(query.bookName);
    return BibleMapper.mapBookInfoToInternal(rows);
  }
}
