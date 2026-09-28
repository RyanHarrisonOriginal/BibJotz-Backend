import { BaseEntity } from '@/domain/shared/base-entity';
import { ValidationError } from '@/domain/shared/errors/validation-error';

export type FollowPolicy = 'OPEN' | 'APPROVAL';

export class User extends BaseEntity {
  constructor(
    id: number | null,
    private displayName: string,
    private clerkUserId: string | null = null,
    private username: string | null = null,
    private bio: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    private followPolicy: FollowPolicy = 'APPROVAL',
    private followListsPublic: boolean = false,
  ) {
    super(id, createdAt, updatedAt);
    if (!displayName?.trim()) throw new ValidationError('displayName is required');
  }

  getDisplayName(): string {
    return this.displayName;
  }

  getClerkUserId(): string | null {
    return this.clerkUserId;
  }

  getUsername(): string | null {
    return this.username;
  }

  getBio(): string | null {
    return this.bio;
  }

  getFollowPolicy(): FollowPolicy {
    return this.followPolicy;
  }

  getFollowListsPublic(): boolean {
    return this.followListsPublic;
  }

  /**
   * Applies only the fields that were sent.
   * Returns whether followPolicy actually changed, and the policy before the change.
   */
  changeFollowSettings(input: { followPolicy?: FollowPolicy; followListsPublic?: boolean }): {
    policyChanged: boolean;
    previousPolicy: FollowPolicy;
  } {
    const previousPolicy = this.followPolicy;
    let changed = false;
    if (input.followPolicy !== undefined && input.followPolicy !== this.followPolicy) {
      this.followPolicy = input.followPolicy;
      changed = true;
    }
    if (input.followListsPublic !== undefined && input.followListsPublic !== this.followListsPublic) {
      this.followListsPublic = input.followListsPublic;
      changed = true;
    }
    if (changed) this.touch();
    return { policyChanged: previousPolicy !== this.followPolicy, previousPolicy };
  }

  updateProfile(options: {
    displayName?: string;
    clerkUserId?: string | null;
    username?: string | null;
    bio?: string | null;
  }): void {
    if (options.displayName !== undefined) {
      if (!options.displayName.trim()) throw new ValidationError('displayName is required');
      this.displayName = options.displayName.trim();
    }
    if (options.clerkUserId !== undefined) {
      this.clerkUserId = options.clerkUserId?.trim() || null;
    }
    if (options.username !== undefined) {
      const next = options.username?.trim() || null;
      if (next && !/^[a-zA-Z0-9_]{3,50}$/.test(next)) {
        throw new ValidationError('username must be 3-50 characters (letters, numbers, underscore)');
      }
      this.username = next;
    }
    if (options.bio !== undefined) {
      const next = options.bio?.trim() || null;
      if (next && next.length > 280) throw new ValidationError('bio must be 280 characters or fewer');
      this.bio = next;
    }
    this.touch();
  }
}
