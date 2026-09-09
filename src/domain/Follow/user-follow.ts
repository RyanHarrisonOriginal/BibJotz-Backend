import { ValidationError } from '@/domain/shared/errors/validation-error';

export class UserFollow {
  constructor(
    private readonly id: number | null,
    private readonly followerId: number,
    private readonly followingId: number,
    private readonly createdAt: Date = new Date(),
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
}
