import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IFollowRequestActionDTO } from '@/domain/Follow/follow.dto';

export class DeclineFollowRequestCommand implements ICommand {
  readonly commandType = 'DeclineFollowRequestCommand';

  constructor(
    public readonly followeeId: number,
    public readonly followerId: number,
  ) {}

  static from(dto: IFollowRequestActionDTO): DeclineFollowRequestCommand {
    const followeeId = Number(dto.followeeId);
    const followerId = parseInt(String(dto.followerId ?? ''), 10);
    if (!followeeId || Number.isNaN(followeeId)) throw new ValidationError('followeeId is required');
    if (Number.isNaN(followerId) || followerId < 1) throw new ValidationError('followerId is required');
    return new DeclineFollowRequestCommand(followeeId, followerId);
  }
}
