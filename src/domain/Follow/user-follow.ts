import { ValidationError } from '@/domain/shared/errors/validation-error';

export type FollowStatus = 'PENDING' | 'ACCEPTED';

export class UserFollow {
  constructor(
    private readonly id: number | null,
    private readonly followerId: number,
    private readonly followingId: number,
    private readonly createdAt: Date = new Date(),
    private status: FollowStatus = 'ACCEPTED',
  ) {
    if (!followerId) throw new ValidationError('followerId is required');
    if (!followingId) throw new ValidationError('followingId is required');
    if (followerId === followingId) throw new ValidationError('Cannot follow yourself');
  }

  getId(): number | null {
    return this.id;
  }

  getFollowerId(): number {
    return this.followerId;
  }

  getFollowingId(): number {
    return this.followingId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getStatus(): FollowStatus {
    return this.status;
  }

  /** Returns true when this call changes PENDING to ACCEPTED. */
  accept(): boolean {
    if (this.status === 'ACCEPTED') return false;
    this.status = 'ACCEPTED';
    return true;
  }
}
