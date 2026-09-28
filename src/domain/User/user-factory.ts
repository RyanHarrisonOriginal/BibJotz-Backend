import { FollowPolicy, User } from '@/domain/User/user';

export interface IUserCreationProps {
  id: number | null;
  displayName: string;
  clerkUserId?: string | null;
  username?: string | null;
  bio?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  followPolicy?: FollowPolicy;
  followListsPublic?: boolean;
}

export class UserFactory {
  static create(data: IUserCreationProps): User {
    return new User(
      data.id,
      data.displayName,
      data.clerkUserId ?? null,
      data.username ?? null,
      data.bio ?? null,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
      data.followPolicy ?? 'APPROVAL',
      data.followListsPublic ?? false,
    );
  }
}
