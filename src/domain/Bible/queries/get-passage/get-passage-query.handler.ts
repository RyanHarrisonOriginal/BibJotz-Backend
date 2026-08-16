import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { IBiblePassage, IBibleRepository } from '@/domain/Bible/bible-repository.interface';
import { BibleMapper } from '@/domain/Bible/bible.mapper';
import { GetPassageQuery } from './get-passage.query';

export class GetPassageQueryHandler implements IQueryHandler<GetPassageQuery, IBiblePassage> {
  constructor(private readonly bibleRepository: IBibleRepository) {}

  async execute(query: GetPassageQuery): Promise<IBiblePassage> {
    const row = await this.bibleRepository.findVerseText({
      bookName: query.bookName,
      chapterNumber: query.chapterNumber,
      startVerse: query.startVerse,
      endVerse: query.endVerse,
      translationCode: query.translationCode,
    });
    return BibleMapper.mapPassageToInternal(row);
  }
}
