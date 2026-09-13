import { User } from '@/domain/User/user';

export interface IUserSearchFilters {
  query: string;
  limit: number;
}

export interface IUserRepository {
  save(user: User): Promise<unknown>;
  findById(id: number): Promise<unknown | null>;
  findByClerkUserId(clerkUserId: string): Promise<unknown | null>;
  search(filters: IUserSearchFilters): Promise<unknown[]>;
}
