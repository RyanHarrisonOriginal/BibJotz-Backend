import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canViewNote, FollowGrant, NoteViewer } from '@/domain/Note/can-view-note';
import { NoteAudience } from '@/domain/Note/note-audience';

const authorId = 10;
const otherId = 20;

const viewers: { role: string; viewer: NoteViewer; grant: FollowGrant }[] = [
  { role: 'owner', viewer: { id: authorId }, grant: 'NONE' },
  { role: 'accepted follower', viewer: { id: otherId }, grant: 'ACCEPTED' },
  { role: 'pending requester', viewer: { id: otherId }, grant: 'PENDING' },
  { role: 'stranger', viewer: { id: otherId }, grant: 'NONE' },
];

const audiences: NoteAudience[] = ['PRIVATE', 'FOLLOWERS', 'PUBLIC'];

function expected(role: string, audience: NoteAudience): boolean {
  if (role === 'owner') return true;
  if (audience === 'PUBLIC') return true;
  if (audience === 'FOLLOWERS' && role === 'accepted follower') return true;
  return false;
}

describe('canViewNote', () => {
  for (const viewerCase of viewers) {
    for (const audience of audiences) {
      it(`${viewerCase.role} x ${audience}`, () => {
        assert.equal(
          canViewNote(viewerCase.viewer, { userId: authorId, audience }, viewerCase.grant),
          expected(viewerCase.role, audience),
        );
      });
    }
  }

  it('null viewer can read a public note', () => {
    assert.equal(canViewNote(null, { userId: authorId, audience: 'PUBLIC' }, 'NONE'), true);
  });

  it('null viewer cannot read a followers note', () => {
    assert.equal(canViewNote(null, { userId: authorId, audience: 'FOLLOWERS' }, 'ACCEPTED'), false);
  });
});
