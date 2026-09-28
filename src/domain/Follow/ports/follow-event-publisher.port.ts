import { FollowPolicy } from '@/domain/User/user';

export type FollowRemovedReason = 'unfollow' | 'cancel' | 'decline' | 'remove-follower';

export type FollowEvent =
  | {
      type: 'FollowRequested';
      followerId: number;
      followeeId: number;
    }
  | {
      type: 'FollowAccepted';
      followerId: number;
      followeeId: number;
    }
  | {
      type: 'FollowRemoved';
      followerId: number;
      followeeId: number;
      reason: FollowRemovedReason;
    }
  | {
      type: 'FollowPolicyChanged';
      userId: number;
      previousPolicy: FollowPolicy;
      followPolicy: FollowPolicy;
    };

export interface IFollowEventPublisher {
  publish(event: FollowEvent): Promise<void>;
}
