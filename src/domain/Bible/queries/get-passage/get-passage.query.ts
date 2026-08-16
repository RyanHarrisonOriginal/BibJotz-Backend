import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IGetPassageParamsDTO } from '@/domain/Bible/bible.dto';

export class GetPassageQuery implements IQuery {
  readonly queryType = 'GetPassageQuery';

  constructor(
    public readonly bookName: string,
    public readonly chapterNumber: number,
    public readonly startVerse: number | undefined,
    public readonly endVerse: number | undefined,
    public readonly translationCode: string | undefined,
  ) {}

  static from(dto: IGetPassageParamsDTO): GetPassageQuery {
    const bookName = dto.bookName?.trim();
    const chapterNumber = parseInt(String(dto.chapterNumber ?? ''), 10);
    if (!bookName) throw new ValidationError('bookName is required');
    if (Number.isNaN(chapterNumber) || chapterNumber < 1) {
      throw new ValidationError('chapterNumber must be a positive integer');
    }

    const parseOptional = (value: string | string[] | undefined): number | undefined => {
      if (value == null || value === '') return undefined;
      const raw = Array.isArray(value) ? value[0] : value;
      if (raw == null || raw === '') return undefined;
      const n = Number(raw);
      return Number.isNaN(n) ? undefined : n;
    };

    const translationRaw = dto.translation;
    const translationCode = Array.isArray(translationRaw) ? translationRaw[0] : translationRaw;

    return new GetPassageQuery(
      bookName,
      chapterNumber,
      parseOptional(dto.start),
      parseOptional(dto.end),
      translationCode?.trim() || undefined,
    );
  }
}
