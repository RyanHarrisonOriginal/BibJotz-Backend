import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { User } from '@/domain/User/user';
import { UserMapper } from '@/domain/User/user.mapper';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { GetUserQuery } from './get-user.query';

export class GetUserQueryHandler implements IQueryHandler<GetUserQuery, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: GetUserQuery): Promise<User> {
    const row = await this.userRepository.findById(query.id);
    if (!row) throw new NotFoundError('User not found');
    return UserMapper.mapUserToDomain(row);
  }
}
