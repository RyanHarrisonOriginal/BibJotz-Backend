import { User } from '@/domain/User/user';

export interface IUserRepository {
  save(user: User): Promise<unknown>;
  findById(id: number): Promise<unknown | null>;
}
