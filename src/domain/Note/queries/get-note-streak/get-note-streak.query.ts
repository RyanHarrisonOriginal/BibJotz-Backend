import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IGetNoteStreakQueryParamsDTO } from '@/domain/Note/note.dto';
import { calendarDateInTimeZone } from '@/domain/Note/note-streak';

const TIME_ZONE_PATTERN = /^[A-Za-z0-9_+\-\/]+$/;
const DEFAULT_TIME_ZONE = 'UTC';

export class GetNoteStreakQuery implements IQuery {
  readonly queryType = 'GetNoteStreakQuery';

  constructor(
    public readonly userId: number,
    public readonly timeZone: string,
  ) {}

  static from(dto: IGetNoteStreakQueryParamsDTO): GetNoteStreakQuery {
    const userIdRaw = Array.isArray(dto.userId) ? dto.userId[0] : dto.userId;
    const userId = parseInt(String(userIdRaw ?? ''), 10);
    if (Number.isNaN(userId) || userId < 1) throw new ValidationError('userId is required');

    const timeZoneRaw = Array.isArray(dto.timeZone) ? dto.timeZone[0] : dto.timeZone;
    const timeZone = (timeZoneRaw?.trim() || DEFAULT_TIME_ZONE);
    if (timeZone.length > 64 || !TIME_ZONE_PATTERN.test(timeZone)) {
      throw new ValidationError('timeZone must be a valid IANA time zone name');
    }

    try {
      calendarDateInTimeZone(new Date(), timeZone);
    } catch {
      throw new ValidationError('timeZone must be a valid IANA time zone name');
    }

    return new GetNoteStreakQuery(userId, timeZone);
  }
}
