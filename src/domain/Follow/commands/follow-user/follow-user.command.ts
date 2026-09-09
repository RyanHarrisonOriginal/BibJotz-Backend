import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IFollowUserRequestDTO } from '@/domain/Follow/follow.dto';

export class FollowUserCommand implements ICommand {
  readonly commandType = 'FollowUserCommand';

  constructor(
    public readonly followerId: number,
    public readonly followingId: number,
  ) {}

  static from(dto: IFollowUserRequestDTO): FollowUserCommand {
    const followerId = Number(dto.followerId);
    const followingId = Number(dto.followingId);
    if (!followerId || Number.isNaN(followerId)) throw new ValidationError('followerId is required');
    if (!followingId || Number.isNaN(followingId)) throw new ValidationError('followingId is required');
    if (followerId === followingId) throw new ValidationError('Cannot follow yourself');
    return new FollowUserCommand(followerId, followingId);
  }
}
