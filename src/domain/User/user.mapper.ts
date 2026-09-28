import { User } from '@/domain/User/user';
import { UserFactory } from '@/domain/User/user-factory';
import { IUserProfileResponseDTO, IUserResponseDTO } from '@/domain/User/user.dto';

type RawUser = {
  id: number;
  displayName: string;
  clerkUserId?: string | null;
  username?: string | null;
  bio?: string | null;
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

  static mapUserToProfileResponseDTO(user: User): IUserProfileResponseDTO {
    return {
      id: user.getId() ?? 0,
      displayName: user.getDisplayName(),
      username: user.getUsername(),
      bio: user.getBio(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
    };
  }

  static mapUsersToResponseDTO(users: User[]): IUserResponseDTO[] {
    return users.map((user) => UserMapper.mapUserToResponseDTO(user));
  }
}
