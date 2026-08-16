import { IQuery } from '@/domain/shared/interfaces/query.interface';

export class GetTranslationsQuery implements IQuery {
  readonly queryType = 'GetTranslationsQuery';

  static from(): GetTranslationsQuery {
    return new GetTranslationsQuery();
  }
}
