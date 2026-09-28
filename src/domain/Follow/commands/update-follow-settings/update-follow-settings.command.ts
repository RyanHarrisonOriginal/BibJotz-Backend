import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { FollowPolicy } from '@/domain/User/user';
import { IUpdateFollowSettingsRequestDTO } from '@/domain/Follow/follow.dto';

function parseFollowPolicy(value: unknown): FollowPolicy {
  const policy = String(value ?? '').trim().toUpperCase();
  if (policy !== 'OPEN' && policy !== 'APPROVAL') {
    throw new ValidationError('followPolicy must be OPEN or APPROVAL');
  }
  return policy;
}

export class UpdateFollowSettingsCommand implements ICommand {
  readonly commandType = 'UpdateFollowSettingsCommand';

  constructor(
    public readonly userId: number,
    public readonly followPolicy: FollowPolicy | undefined,
    public readonly followListsPublic: boolean | undefined,
  ) {}

  static from(dto: IUpdateFollowSettingsRequestDTO): UpdateFollowSettingsCommand {
    const userId = Number(dto.userId);
    if (!userId || Number.isNaN(userId)) throw new ValidationError('userId is required');

    const hasPolicy = dto.followPolicy !== undefined;
    const hasLists = dto.followListsPublic !== undefined;
    if (!hasPolicy && !hasLists) {
      throw new ValidationError('Provide followPolicy and/or followListsPublic');
    }
    const followListsPublic = typeof dto.followListsPublic === 'boolean' ? dto.followListsPublic : undefined;
    if (hasLists && followListsPublic === undefined) {
      throw new ValidationError('followListsPublic must be boolean');
    }

    return new UpdateFollowSettingsCommand(
      userId,
      hasPolicy ? parseFollowPolicy(dto.followPolicy) : undefined,
      followListsPublic,
    );
  }
}
