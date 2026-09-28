import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { audienceFromLegacyFlags } from '@/domain/Note/note-audience';
import { CreateNoteCommand } from '@/domain/Note/commands/create-note/create-note.command';
import { UpdateNoteCommand } from '@/domain/Note/commands/update-note/update-note.command';

describe('audience backfill mapping', () => {
  const cases: [boolean, boolean, 'PRIVATE' | 'FOLLOWERS' | 'PUBLIC'][] = [
    [false, false, 'PRIVATE'],
    [true, false, 'PUBLIC'],
    [true, true, 'PUBLIC'],
    [false, true, 'FOLLOWERS'],
  ];

  for (const [profileVisible, feedShared, audience] of cases) {
    it(`profileVisible=${profileVisible} feedShared=${feedShared} -> ${audience}`, () => {
      assert.equal(audienceFromLegacyFlags(profileVisible, feedShared), audience);
    });
  }

  it('migration SQL uses the same CASE as audienceFromLegacyFlags', () => {
    const sql = readFileSync(
      join(
        __dirname,
        '../../../prisma/app/migrations/20260928010000_note_audience_and_follow_status/migration.sql',
      ),
      'utf8',
    );
    assert.match(sql, /WHEN is_profile_visible THEN 'PUBLIC'/);
    assert.match(sql, /WHEN is_feed_shared THEN 'FOLLOWERS'/);
    assert.match(sql, /ELSE 'PRIVATE'/);
    assert.match(sql, /ADD COLUMN "status" "jotz"\."FollowStatus" NOT NULL DEFAULT 'ACCEPTED'/);
    assert.match(sql, /follow_policy" "jotz"\."FollowPolicy" NOT NULL DEFAULT 'APPROVAL'/);
    assert.match(sql, /follow_lists_public" BOOLEAN NOT NULL DEFAULT false/);
    assert.match(sql, /DROP COLUMN "is_profile_visible"/);
    assert.match(sql, /DROP COLUMN "is_feed_shared"/);
    assert.match(sql, /follower_id <> following_id/);
    const updateAt = sql.indexOf('SET "audience" = CASE');
    const dropAt = sql.indexOf('DROP COLUMN "is_profile_visible"');
    assert.ok(updateAt > 0 && dropAt > updateAt);
  });
});

describe('legacy visibility fields', () => {
  it('create rejects isProfileVisible', () => {
    assert.throws(
      () =>
        CreateNoteCommand.from({
          userId: 1,
          content: 'hello',
          bookName: 'John',
          bookShortName: 'Jn',
          isProfileVisible: true,
        }),
      /no longer supported/,
    );
  });

  it('update rejects isFeedShared', () => {
    assert.throws(
      () => UpdateNoteCommand.from({ id: '1', actorUserId: 1, isFeedShared: true }),
      /no longer supported/,
    );
  });
});
