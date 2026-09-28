import { Prisma } from '@/generated/app-client';

/**
 * Notes this viewer may read. Same rule as canViewNote:
 * owner, PUBLIC, or FOLLOWERS with an ACCEPTED follow from the viewer.
 */
export function visibleNoteWhere(viewerUserId: number): Prisma.NoteWhereInput {
  return {
    OR: [
      { userId: viewerUserId },
      { audience: 'PUBLIC' },
      {
        audience: 'FOLLOWERS',
        user: {
          followers: {
            some: {
              followerId: viewerUserId,
              status: 'ACCEPTED',
            },
          },
        },
      },
    ],
  };
}
