import { UserFollow } from '@/domain/Follow/user-follow';
import { IFollowResponseDTO, IFollowUserSummaryDTO } from '@/domain/Follow/follow.dto';

type RawFollow = {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: Date;
  follower?: {
    id: number;
    displayName: string;
    username: string | null;
  };
  following?: {
    id: number;
    displayName: string;
    username: string | null;
  };
};

export class FollowMapper {
  static mapFollowToDomain(raw: unknown): UserFollow {
    const row = raw as RawFollow;
    return new UserFollow(row.id, row.followerId, row.followingId, row.createdAt);
  }

  static mapFollowToResponseDTO(follow: UserFollow): IFollowResponseDTO {
    return {
      id: follow.getId() ?? 0,
      followerId: follow.getFollowerId(),
      followingId: follow.getFollowingId(),
      createdAt: follow.getCreatedAt().toISOString(),
    };
  }

  static mapFollowersToSummaryDTO(raw: unknown[]): IFollowUserSummaryDTO[] {
    return (raw as RawFollow[]).flatMap((row) => {
      if (!row.follower) return [];
      return [
        {
          id: row.follower.id,
          displayName: row.follower.displayName,
          username: row.follower.username,
          followedAt: row.createdAt.toISOString(),
        },
      ];
    });
  }

  static mapFollowingToSummaryDTO(raw: unknown[]): IFollowUserSummaryDTO[] {
    return (raw as RawFollow[]).flatMap((row) => {
      if (!row.following) return [];
      return [
        {
          id: row.following.id,
          displayName: row.following.displayName,
          username: row.following.username,
          followedAt: row.createdAt.toISOString(),
        },
      ];
    });
  }
}
