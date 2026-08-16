import { User } from '@/domain/User/user';

export interface IUserCreationProps {
  id: number | null;
  displayName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserFactory {
  static create(data: IUserCreationProps): User {
    return new User(data.id, data.displayName, data.createdAt ?? new Date(), data.updatedAt ?? new Date());
  }
}
