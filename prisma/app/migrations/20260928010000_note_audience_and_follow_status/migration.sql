-- Note audience replaces is_profile_visible / is_feed_shared.
-- Mapping: profile visible -> PUBLIC (even if also feed shared);
-- feed shared only -> FOLLOWERS; neither -> PRIVATE.
-- Existing follows become ACCEPTED. Existing users become APPROVAL / lists private.
-- followee is the existing following_id column.

CREATE TYPE "jotz"."NoteAudience" AS ENUM ('PRIVATE', 'FOLLOWERS', 'PUBLIC');
CREATE TYPE "jotz"."FollowStatus" AS ENUM ('PENDING', 'ACCEPTED');
CREATE TYPE "jotz"."FollowPolicy" AS ENUM ('OPEN', 'APPROVAL');

DO $$
DECLARE
  private_count int;
  public_count int;
  followers_count int;
  follow_count int;
  user_count int;
BEGIN
  SELECT count(*) INTO private_count
  FROM jotz.notes
  WHERE is_profile_visible = false AND is_feed_shared = false;

  SELECT count(*) INTO public_count
  FROM jotz.notes
  WHERE is_profile_visible = true;

  SELECT count(*) INTO followers_count
  FROM jotz.notes
  WHERE is_profile_visible = false AND is_feed_shared = true;

  SELECT count(*) INTO follow_count FROM jotz.user_follows;
  SELECT count(*) INTO user_count FROM jotz.users;

  RAISE NOTICE 'note backfill PRIVATE=% PUBLIC=% FOLLOWERS=%', private_count, public_count, followers_count;
  RAISE NOTICE 'follow backfill ACCEPTED=%', follow_count;
  RAISE NOTICE 'user backfill follow_policy=APPROVAL follow_lists_public=false=%', user_count;
END $$;

ALTER TABLE "jotz"."notes" ADD COLUMN "audience" "jotz"."NoteAudience";

UPDATE "jotz"."notes"
SET "audience" = CASE
  WHEN is_profile_visible THEN 'PUBLIC'::"jotz"."NoteAudience"
  WHEN is_feed_shared THEN 'FOLLOWERS'::"jotz"."NoteAudience"
  ELSE 'PRIVATE'::"jotz"."NoteAudience"
END;

ALTER TABLE "jotz"."notes" ALTER COLUMN "audience" SET DEFAULT 'PRIVATE';
ALTER TABLE "jotz"."notes" ALTER COLUMN "audience" SET NOT NULL;
ALTER TABLE "jotz"."notes" DROP COLUMN "is_profile_visible";
ALTER TABLE "jotz"."notes" DROP COLUMN "is_feed_shared";

ALTER TABLE "jotz"."user_follows"
  ADD COLUMN "status" "jotz"."FollowStatus" NOT NULL DEFAULT 'ACCEPTED';

ALTER TABLE "jotz"."users"
  ADD COLUMN "follow_policy" "jotz"."FollowPolicy" NOT NULL DEFAULT 'APPROVAL',
  ADD COLUMN "follow_lists_public" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "jotz"."user_follows"
  ADD CONSTRAINT "user_follows_no_self_follow" CHECK (follower_id <> following_id);
