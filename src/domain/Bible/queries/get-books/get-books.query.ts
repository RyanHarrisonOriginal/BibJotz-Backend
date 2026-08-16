import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { IGetBooksQueryParamsDTO } from '@/domain/Bible/bible.dto';

export class GetBooksQuery implements IQuery {
  readonly queryType = 'GetBooksQuery';

  constructor(public readonly translationCode: string) {}

  static from(dto: IGetBooksQueryParamsDTO): GetBooksQuery {
    const raw = dto.translation;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return new GetBooksQuery(value?.trim() || 'BSB');
  }
}
