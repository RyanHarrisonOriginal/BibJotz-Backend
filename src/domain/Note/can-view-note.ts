import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';

export interface NoteViewer {
  id: number | null;
}

export interface ViewableNote {
  userId: number;
  isProfileVisible: boolean;
  isFeedShared: boolean;
}

/**
 * Owner can always view. Otherwise the note is visible when it is on the
 * author's profile, or when it is feed-shared and the viewer follows the author.
 */
export function canViewNote(
  viewer: NoteViewer | null,
  note: ViewableNote,
  isFollower: boolean,
): boolean {
  const viewerId = viewer?.id ?? null;
  if (viewerId != null && viewerId === note.userId) return true;
  if (note.isProfileVisible) return true;
  if (note.isFeedShared && isFollower) return true;
  return false;
}

export function viewableNoteFrom(note: {
  getUserId(): number;
  getIsProfileVisible(): boolean;
  getIsFeedShared(): boolean;
}): ViewableNote {
  return {
    userId: note.getUserId(),
    isProfileVisible: note.getIsProfileVisible(),
    isFeedShared: note.getIsFeedShared(),
  };
}

/** Follow is only needed when feed sharing is the remaining way to see the note. */
function followLookupNeeded(viewerId: number | null, note: ViewableNote): boolean {
  if (viewerId == null) return false;
  if (viewerId === note.userId) return false;
  if (note.isProfileVisible) return false;
  return note.isFeedShared;
}

export async function resolveIsFollower(
  followRepository: IFollowRepository,
  viewerId: number | null,
  note: ViewableNote,
  cache?: Map<number, boolean>,
): Promise<boolean> {
  if (viewerId == null || !followLookupNeeded(viewerId, note)) return false;

  const cached = cache?.get(note.userId);
  if (cached !== undefined) return cached;

  const follow = await followRepository.findByPair(viewerId, note.userId);
  const isFollower = follow != null;
  cache?.set(note.userId, isFollower);
  return isFollower;
}
