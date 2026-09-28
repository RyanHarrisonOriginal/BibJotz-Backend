import { User } from '@/domain/User/user';
import { UserFactory } from '@/domain/User/user-factory';
import { IUserMeResponseDTO, IUserProfileResponseDTO, IUserResponseDTO, ViewerFollowStatus } from '@/domain/User/user.dto';

type RawUser = {
  id: number;
  displayName: string;
  clerkUserId?: string | null;
  username?: string | null;
  bio?: string | null;
  followPolicy?: 'OPEN' | 'APPROVAL';
  followListsPublic?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class UserMapper {
  static mapUserToPersistence(user: User): Record<string, unknown> {
    return {
      id: user.getId(),
      displayName: user.getDisplayName(),
      clerkUserId: user.getClerkUserId(),
      username: user.getUsername(),
      bio: user.getBio(),
      followPolicy: user.getFollowPolicy(),
      followListsPublic: user.getFollowListsPublic(),
    };
  }

  static mapUserToDomain(raw: unknown): User {
    const row = raw as RawUser;
    return UserFactory.create({
      id: row.id,
      displayName: row.displayName,
      clerkUserId: row.clerkUserId ?? null,
      username: row.username ?? null,
      bio: row.bio ?? null,
      followPolicy: row.followPolicy ?? 'APPROVAL',
      followListsPublic: row.followListsPublic ?? false,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static mapUserToResponseDTO(user: User): IUserResponseDTO {
    return {
      id: user.getId() ?? 0,
      displayName: user.getDisplayName(),
      clerkUserId: user.getClerkUserId(),
      username: user.getUsername(),
      bio: user.getBio(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
    };
  }

  static mapUserToMeResponseDTO(user: User, pendingRequestCount: number): IUserMeResponseDTO {
    return {
      ...UserMapper.mapUserToResponseDTO(user),
      followPolicy: user.getFollowPolicy(),
      followListsPublic: user.getFollowListsPublic(),
      pendingRequestCount,
    };
  }

  static mapUserToProfileResponseDTO(
    user: User,
    followerCount: number,
    followingCount: number,
    viewerFollowStatus: ViewerFollowStatus,
  ): IUserProfileResponseDTO {
    return {
      id: user.getId() ?? 0,
      displayName: user.getDisplayName(),
      username: user.getUsername(),
      bio: user.getBio(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
      followerCount,
      followingCount,
      followPolicy: user.getFollowPolicy(),
      viewerFollowStatus,
    };
  }

  static mapUsersToResponseDTO(users: User[]): IUserResponseDTO[] {
    return users.map((user) => UserMapper.mapUserToResponseDTO(user));
  }
}
