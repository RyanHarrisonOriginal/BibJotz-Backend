import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IGetBookInfoParamsDTO } from '@/domain/Bible/bible.dto';

export class GetBookInfoQuery implements IQuery {
  readonly queryType = 'GetBookInfoQuery';

  constructor(public readonly bookName: string) {}

  static from(dto: IGetBookInfoParamsDTO): GetBookInfoQuery {
    const bookName = dto.bookName?.trim();
    if (!bookName) throw new ValidationError('bookName is required');
    return new GetBookInfoQuery(bookName);
  }
}
