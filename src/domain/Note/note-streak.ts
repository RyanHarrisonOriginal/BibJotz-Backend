/**
 * Consecutive calendar days (YYYY-MM-DD) with activity.
 * Streak stays alive if the latest active day is today or yesterday.
 */
export function computeConsecutiveDayStreak(activeDays: Iterable<string>, today: string): number {
  const days = new Set(activeDays);
  if (days.size === 0) return 0;

  const yesterday = shiftIsoDate(today, -1);
  let cursor: string;
  if (days.has(today)) cursor = today;
  else if (days.has(yesterday)) cursor = yesterday;
  else return 0;

  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = shiftIsoDate(cursor, -1);
  }
  return streak;
}

/** Local calendar date for `now` in an IANA time zone (YYYY-MM-DD). */
export function calendarDateInTimeZone(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function shiftIsoDate(isoDate: string, deltaDays: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + deltaDays);
  return date.toISOString().slice(0, 10);
}
