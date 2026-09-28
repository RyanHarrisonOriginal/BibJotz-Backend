import { ForbiddenError } from '@/domain/shared/errors/forbidden-error';
import { FollowGrant } from '@/domain/Note/can-view-note';

export function canViewFollowLists(input: {
  viewerId: number;
  targetUserId: number;
  followListsPublic: boolean;
  viewerFollowGrant: FollowGrant;
}): boolean {
  if (input.followListsPublic) return true;
  if (input.viewerId === input.targetUserId) return true;
  return input.viewerFollowGrant === 'ACCEPTED';
}

export function assertCanViewFollowLists(input: {
  viewerId: number;
  targetUserId: number;
  followListsPublic: boolean;
  viewerFollowGrant: FollowGrant;
}): void {
  if (!canViewFollowLists(input)) {
    throw new ForbiddenError('Follow lists are private');
  }
}
