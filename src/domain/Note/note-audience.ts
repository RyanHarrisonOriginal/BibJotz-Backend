import { ValidationError } from '@/domain/shared/errors/validation-error';

export const NOTE_AUDIENCES = ['PRIVATE', 'FOLLOWERS', 'PUBLIC'] as const;
export type NoteAudience = (typeof NOTE_AUDIENCES)[number];

export function parseNoteAudience(value: unknown): NoteAudience {
  const audience = String(value ?? '').trim().toUpperCase();
  if (!NOTE_AUDIENCES.includes(audience as NoteAudience)) {
    throw new ValidationError('audience must be PRIVATE, FOLLOWERS, or PUBLIC');
  }
  return audience as NoteAudience;
}

export function rejectLegacyVisibilityFields(dto: {
  isProfileVisible?: unknown;
  isFeedShared?: unknown;
}): void {
  if (dto.isProfileVisible !== undefined || dto.isFeedShared !== undefined) {
    throw new ValidationError(
      'isProfileVisible and isFeedShared are no longer supported; send audience',
    );
  }
}

/** Same CASE as the audience migration. profileVisible wins over feedShared. */
export function audienceFromLegacyFlags(isProfileVisible: boolean, isFeedShared: boolean): NoteAudience {
  if (isProfileVisible) return 'PUBLIC';
  if (isFeedShared) return 'FOLLOWERS';
  return 'PRIVATE';
}
