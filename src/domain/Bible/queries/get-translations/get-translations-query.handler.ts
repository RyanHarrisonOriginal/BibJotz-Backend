import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { IBibleRepository, ITranslation } from '@/domain/Bible/bible-repository.interface';
import { BibleMapper } from '@/domain/Bible/bible.mapper';
import { GetTranslationsQuery } from './get-translations.query';

export class GetTranslationsQueryHandler implements IQueryHandler<GetTranslationsQuery, ITranslation[]> {
  constructor(private readonly bibleRepository: IBibleRepository) {}

  async execute(_query: GetTranslationsQuery): Promise<ITranslation[]> {
    const rows = await this.bibleRepository.findAllTranslations();
    return BibleMapper.mapTranslationsToInternal(rows);
  }
}
