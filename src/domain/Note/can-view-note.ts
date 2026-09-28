import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { NoteAudience } from '@/domain/Note/note-audience';

export type FollowGrant = 'NONE' | 'PENDING' | 'ACCEPTED';

export interface NoteViewer {
  id: number | null;
}

export interface ViewableNote {
  userId: number;
  audience: NoteAudience;
}

/**
 * Owner can always view. PUBLIC is visible to anyone.
 * FOLLOWERS requires an ACCEPTED follow from the viewer to the author.
 * PENDING and PRIVATE grant nothing to anyone else.
 */
export function canViewNote(
  viewer: NoteViewer | null,
  note: ViewableNote,
  followGrant: FollowGrant,
): boolean {
  const viewerId = viewer?.id ?? null;
  if (viewerId != null && viewerId === note.userId) return true;
  if (note.audience === 'PUBLIC') return true;
  if (note.audience === 'FOLLOWERS' && viewerId != null && followGrant === 'ACCEPTED') return true;
  return false;
}

export function viewableNoteFrom(note: {
  getUserId(): number;
  getAudience(): NoteAudience;
}): ViewableNote {
  return {
    userId: note.getUserId(),
    audience: note.getAudience(),
  };
}

/** Follow status is only needed for another author's FOLLOWERS note. */
export function followLookupNeeded(viewerId: number | null, note: ViewableNote): boolean {
  if (viewerId == null) return false;
  if (viewerId === note.userId) return false;
  return note.audience === 'FOLLOWERS';
}

export function followGrantFrom(row: unknown): FollowGrant {
  if (row == null || typeof row !== 'object') return 'NONE';
  const status = (row as { status?: string }).status;
  if (status === 'ACCEPTED' || status === 'PENDING') return status;
  return 'NONE';
}

export async function resolveFollowGrant(
  followRepository: IFollowRepository,
  viewerId: number | null,
  note: ViewableNote,
  cache?: Map<number, FollowGrant>,
): Promise<FollowGrant> {
  if (viewerId == null || !followLookupNeeded(viewerId, note)) return 'NONE';

  const cached = cache?.get(note.userId);
  if (cached !== undefined) return cached;

  const follow = await followRepository.findByPair(viewerId, note.userId);
  const grant = followGrantFrom(follow);
  cache?.set(note.userId, grant);
  return grant;
}
