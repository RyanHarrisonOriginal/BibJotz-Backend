import { User } from '@/domain/User/user';

export interface IUserSearchFilters {
  query: string;
  limit: number;
}

export interface ISavedFollowSettings {
  raw: unknown;
  acceptedFollowerIds: number[];
}

export interface IUserRepository {
  save(user: User): Promise<unknown>;
  findById(id: number): Promise<unknown | null>;
  findByClerkUserId(clerkUserId: string): Promise<unknown | null>;
  search(filters: IUserSearchFilters): Promise<unknown[]>;
  /**
   * Persists follow settings. When acceptPendingRequests is true, every PENDING
   * request to this user becomes ACCEPTED in the same transaction.
   */
  saveFollowSettings(user: User, acceptPendingRequests: boolean): Promise<ISavedFollowSettings>;
}
