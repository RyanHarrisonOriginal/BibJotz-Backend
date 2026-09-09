import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { UnfollowUserCommand } from './unfollow-user.command';

export class UnfollowUserCommandHandler implements ICommandHandler<UnfollowUserCommand, void> {
  constructor(private readonly followRepository: IFollowRepository) {}

  async execute(command: UnfollowUserCommand): Promise<void> {
    const existing = await this.followRepository.findByPair(command.followerId, command.followingId);
    if (!existing) throw new NotFoundError('Follow relationship not found');
    await this.followRepository.deleteByPair(command.followerId, command.followingId);
  }
}
