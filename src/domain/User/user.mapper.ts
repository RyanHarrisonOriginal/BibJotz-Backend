import { User } from '@/domain/User/user';
import { UserFactory } from '@/domain/User/user-factory';
import { IUserResponseDTO } from '@/domain/User/user.dto';

type RawUser = {
  id: number;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UserMapper {
  static mapUserToPersistence(user: User): Record<string, unknown> {
    return {
      id: user.getId(),
      displayName: user.getDisplayName(),
    };
  }

  static mapUserToDomain(raw: unknown): User {
    const row = raw as RawUser;
    return UserFactory.create({
      id: row.id,
      displayName: row.displayName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static mapUserToResponseDTO(user: User): IUserResponseDTO {
    return {
      id: user.getId() ?? 0,
      displayName: user.getDisplayName(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
    };
  }
}
