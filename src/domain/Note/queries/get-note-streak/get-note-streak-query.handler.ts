import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { calendarDateInTimeZone, computeConsecutiveDayStreak } from '@/domain/Note/note-streak';
import { GetNoteStreakQuery } from './get-note-streak.query';

export type NoteStreakResult = {
  streak: number;
};

export class GetNoteStreakQueryHandler implements IQueryHandler<GetNoteStreakQuery, NoteStreakResult> {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(query: GetNoteStreakQuery): Promise<NoteStreakResult> {
    let days: string[];
    try {
      days = await this.noteRepository.findDistinctCreatedDays(query.userId, query.timeZone);
    } catch (error) {
      if (isInvalidTimeZoneError(error)) {
        throw new ValidationError('timeZone must be a valid IANA time zone name');
      }
      throw error;
    }

    const today = calendarDateInTimeZone(new Date(), query.timeZone);
    return { streak: computeConsecutiveDayStreak(days, today) };
  }
}

function isInvalidTimeZoneError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /time zone|timezone/i.test(message);
}
