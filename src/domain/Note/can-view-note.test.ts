import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canViewNote } from '@/domain/Note/can-view-note';

const authorId = 10;
const viewerId = 20;

const cases: Array<{
  role: 'owner' | 'follower' | 'non-follower';
  isProfileVisible: boolean;
  isFeedShared: boolean;
  expected: boolean;
}> = [
  { role: 'owner', isProfileVisible: true, isFeedShared: true, expected: true },
  { role: 'owner', isProfileVisible: true, isFeedShared: false, expected: true },
  { role: 'owner', isProfileVisible: false, isFeedShared: true, expected: true },
  { role: 'owner', isProfileVisible: false, isFeedShared: false, expected: true },
  { role: 'follower', isProfileVisible: true, isFeedShared: true, expected: true },
  { role: 'follower', isProfileVisible: true, isFeedShared: false, expected: true },
  { role: 'follower', isProfileVisible: false, isFeedShared: true, expected: true },
  { role: 'follower', isProfileVisible: false, isFeedShared: false, expected: false },
  { role: 'non-follower', isProfileVisible: true, isFeedShared: true, expected: true },
  { role: 'non-follower', isProfileVisible: true, isFeedShared: false, expected: true },
  { role: 'non-follower', isProfileVisible: false, isFeedShared: true, expected: false },
  { role: 'non-follower', isProfileVisible: false, isFeedShared: false, expected: false },
];

describe('canViewNote', () => {
  for (const testCase of cases) {
    it(`${testCase.role}, profileVisible=${testCase.isProfileVisible}, feedShared=${testCase.isFeedShared}`, () => {
      const viewer = { id: testCase.role === 'owner' ? authorId : viewerId };
      const isFollower = testCase.role === 'follower';
      const actual = canViewNote(
        viewer,
        {
          userId: authorId,
          isProfileVisible: testCase.isProfileVisible,
          isFeedShared: testCase.isFeedShared,
        },
        isFollower,
      );
      assert.equal(actual, testCase.expected);
    });
  }

  it('null viewer can see a profile-visible note', () => {
    assert.equal(
      canViewNote(null, { userId: authorId, isProfileVisible: true, isFeedShared: false }, false),
      true,
    );
  });

  it('null viewer cannot see a feed-shared note', () => {
    assert.equal(
      canViewNote(null, { userId: authorId, isProfileVisible: false, isFeedShared: true }, false),
      false,
    );
  });
});
