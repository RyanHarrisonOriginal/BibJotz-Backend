import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { IBibleRepository, IChapterInfo } from '@/domain/Bible/bible-repository.interface';
import { BibleMapper } from '@/domain/Bible/bible.mapper';
import { GetChapterInfoQuery } from './get-chapter-info.query';

export class GetChapterInfoQueryHandler implements IQueryHandler<GetChapterInfoQuery, IChapterInfo> {
  constructor(private readonly bibleRepository: IBibleRepository) {}

  async execute(query: GetChapterInfoQuery): Promise<IChapterInfo> {
    const rows = await this.bibleRepository.findChapterInfo(query.bookName, query.chapterNumber);
    return BibleMapper.mapChapterInfoToInternal(rows);
  }
}
