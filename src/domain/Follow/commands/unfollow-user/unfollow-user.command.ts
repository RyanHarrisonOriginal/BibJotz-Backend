import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IUnfollowUserRequestDTO } from '@/domain/Follow/follow.dto';

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export class UnfollowUserCommand implements ICommand {
  readonly commandType = 'UnfollowUserCommand';

  constructor(
    public readonly followerId: number,
    public readonly followingId: number,
  ) {}

  static from(dto: IUnfollowUserRequestDTO): UnfollowUserCommand {
    const followerId = parseInt(String(first(dto.followerId) ?? ''), 10);
    const followingId = parseInt(String(dto.followingId ?? ''), 10);
    if (Number.isNaN(followerId) || followerId < 1) throw new ValidationError('followerId is required');
    if (Number.isNaN(followingId) || followingId < 1) throw new ValidationError('followingId is required');
    return new UnfollowUserCommand(followerId, followingId);
  }
}
