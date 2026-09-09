import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { UserFollow } from '@/domain/Follow/user-follow';
import { FollowMapper } from '@/domain/Follow/follow.mapper';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { FollowUserCommand } from './follow-user.command';

export class FollowUserCommandHandler implements ICommandHandler<FollowUserCommand, UserFollow> {
  constructor(
    private readonly followRepository: IFollowRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: FollowUserCommand): Promise<UserFollow> {
    const [follower, following] = await Promise.all([
      this.userRepository.findById(command.followerId),
      this.userRepository.findById(command.followingId),
    ]);
    if (!follower) throw new NotFoundError('Follower user not found');
    if (!following) throw new NotFoundError('User to follow not found');

    const existing = await this.followRepository.findByPair(command.followerId, command.followingId);
    if (existing) throw new ValidationError('Already following this user');

    const follow = new UserFollow(null, command.followerId, command.followingId);
    const saved = await this.followRepository.save(follow);
    return FollowMapper.mapFollowToDomain(saved);
  }
}
