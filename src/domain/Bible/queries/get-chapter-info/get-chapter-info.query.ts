import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IGetChapterInfoParamsDTO } from '@/domain/Bible/bible.dto';

export class GetChapterInfoQuery implements IQuery {
  readonly queryType = 'GetChapterInfoQuery';

  constructor(
    public readonly bookName: string,
    public readonly chapterNumber: number,
  ) {}

  static from(dto: IGetChapterInfoParamsDTO): GetChapterInfoQuery {
    const bookName = dto.bookName?.trim();
    const chapterNumber = parseInt(String(dto.chapterNumber ?? ''), 10);
    if (!bookName) throw new ValidationError('bookName is required');
    if (Number.isNaN(chapterNumber) || chapterNumber < 1) {
      throw new ValidationError('chapterNumber must be a positive integer');
    }
    return new GetChapterInfoQuery(bookName, chapterNumber);
  }
}
