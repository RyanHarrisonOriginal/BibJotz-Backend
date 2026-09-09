import { User } from '@/domain/User/user';
import { UserFactory } from '@/domain/User/user-factory';
import { UserMapper } from '@/domain/User/user.mapper';
import { IUserRepository } from '@/domain/User/user-repository.interface';

export type EnsureUserParams = {
  clerkUserId: string;
  displayName?: string;
  username?: string | null;
  bio?: string | null;
};

/**
 * Find the BibJotz user for a Clerk id, or create one.
 * Safe under concurrent first-request races (unique clerk_user_id).
 */
export async function ensureUserForClerkId(
  userRepository: IUserRepository,
  params: EnsureUserParams,
): Promise<User> {
  const existing = await userRepository.findByClerkUserId(params.clerkUserId);
  if (existing) return UserMapper.mapUserToDomain(existing);

  const user = UserFactory.create({
    id: null,
    displayName: params.displayName?.trim() || 'Reader',
    clerkUserId: params.clerkUserId,
    username: params.username ?? null,
    bio: params.bio ?? null,
  });

  try {
    const saved = await userRepository.save(user);
    return UserMapper.mapUserToDomain(saved);
  } catch (error) {
    // Concurrent ensure: another request created the row first
    const raced = await userRepository.findByClerkUserId(params.clerkUserId);
    if (raced) return UserMapper.mapUserToDomain(raced);
    throw error;
  }
}
