import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Prisma } from '@/generated/app-client';
import { canViewNote, FollowGrant } from '@/domain/Note/can-view-note';
import { NoteAudience } from '@/domain/Note/note-audience';
import { visibleNoteWhere } from '@/infrastructure/persistence/postgres/visible-note-where';

const authorId = 10;
const viewerId = 20;

type Row = { userId: number; audience: NoteAudience };

function matches(where: Prisma.NoteWhereInput, note: Row, grant: FollowGrant): boolean {
  const and = where.AND;
  if (and) {
    const parts = Array.isArray(and) ? and : [and];
    return parts.every((part) => matches(part, note, grant));
  }
  const or = where.OR;
  if (or) {
    const parts = Array.isArray(or) ? or : [or];
    return parts.some((part) => matches(part, note, grant));
  }
  const not = where.NOT;
  if (not && !Array.isArray(not)) {
    return !matches(not, note, grant);
  }

  if (typeof where.userId === 'number' && note.userId !== where.userId) return false;
  if (typeof where.audience === 'string' && note.audience !== where.audience) return false;

  const followers = where.user && typeof where.user === 'object' && 'followers' in where.user
    ? where.user.followers
    : undefined;
  if (followers && typeof followers === 'object' && 'some' in followers) {
    const some = followers.some;
    if (!some || typeof some !== 'object') return false;
    if (some.status !== 'ACCEPTED') return false;
    if (some.followerId !== viewerId) return false;
    if (grant !== 'ACCEPTED') return false;
  }

  return true;
}

describe('visibleNoteWhere parity with canViewNote', () => {
  const cases: { role: string; viewer: number; grant: FollowGrant }[] = [
    { role: 'owner', viewer: authorId, grant: 'NONE' },
    { role: 'accepted follower', viewer: viewerId, grant: 'ACCEPTED' },
    { role: 'pending requester', viewer: viewerId, grant: 'PENDING' },
    { role: 'stranger', viewer: viewerId, grant: 'NONE' },
  ];
  const audiences: NoteAudience[] = ['PRIVATE', 'FOLLOWERS', 'PUBLIC'];

  for (const viewerCase of cases) {
    for (const audience of audiences) {
      it(`${viewerCase.role} x ${audience}`, () => {
        const note: Row = { userId: authorId, audience };
        const rule = canViewNote({ id: viewerCase.viewer }, note, viewerCase.grant);
        const predicate = matches(visibleNoteWhere(viewerCase.viewer), note, viewerCase.grant);
        assert.equal(predicate, rule);
      });
    }
  }
});
