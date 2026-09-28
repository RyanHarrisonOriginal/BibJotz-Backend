import { Request, Response } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { User } from '@/domain/User/user';
import { UserMapper } from '@/domain/User/user.mapper';
import { CreateUserCommand } from '@/domain/User/commands/create-user/create-user.command';
import { UpdateUserCommand } from '@/domain/User/commands/update-user/update-user.command';
import { GetUserQuery } from '@/domain/User/queries/get-user/get-user.query';
import { UserFollow } from '@/domain/Follow/user-follow';
import { FollowMapper } from '@/domain/Follow/follow.mapper';
import { IFollowUserSummaryDTO } from '@/domain/Follow/follow.dto';
import { FollowUserCommand } from '@/domain/Follow/commands/follow-user/follow-user.command';
import { UnfollowUserCommand } from '@/domain/Follow/commands/unfollow-user/unfollow-user.command';
import { ListFollowersQuery } from '@/domain/Follow/queries/list-followers/list-followers.query';
import { ListFollowingQuery } from '@/domain/Follow/queries/list-following/list-following.query';
import { ListProfileNotesQuery } from '@/domain/Note/queries/list-profile-notes/list-profile-notes.query';
import { INoteResponseDTO } from '@/domain/Note/note.dto';
import { UnauthorizedError } from '@/domain/shared/errors/unauthorized-error';
import { ForbiddenError } from '@/domain/shared/errors/forbidden-error';
import { requireAuthUser, requireAuthUserId } from '@/middleware/auth';

export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /** Upsert the DB user for the authenticated Clerk identity. */
  ensureMe = async (req: Request, res: Response): Promise<void> => {
    const clerkUserId = req.clerkUserId;
    if (!clerkUserId) throw new UnauthorizedError('Authentication required');

    const command = CreateUserCommand.from({
      displayName: req.body?.displayName,
      clerkUserId,
      username: req.body?.username,
      bio: req.body?.bio,
    });
    const result = await this.commandBus.execute<CreateUserCommand, User>(command);
    res.status(200).json(UserMapper.mapUserToResponseDTO(result));
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    const user = requireAuthUser(req);
    res.json(UserMapper.mapUserToResponseDTO(user));
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    await this.ensureMe(req, res);
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const authUserId = requireAuthUserId(req);
    const targetId = parseInt(String(req.params.id ?? ''), 10);
    if (targetId !== authUserId) {
      throw new ForbiddenError('You can only update your own profile');
    }

    const command = UpdateUserCommand.from({
      ...req.params,
      displayName: req.body?.displayName,
      username: req.body?.username,
      bio: req.body?.bio,
    });
    const result = await this.commandBus.execute<UpdateUserCommand, User>(command);
    res.json(UserMapper.mapUserToResponseDTO(result));
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    const query = GetUserQuery.from(req.params);
    const result = await this.queryBus.execute<GetUserQuery, User>(query);
    res.json(UserMapper.mapUserToProfileResponseDTO(result));
  };

  followUser = async (req: Request, res: Response): Promise<void> => {
    const command = FollowUserCommand.from({
      followerId: requireAuthUserId(req),
      followingId: req.params.id,
    });
    const result = await this.commandBus.execute<FollowUserCommand, UserFollow>(command);
    res.status(201).json(FollowMapper.mapFollowToResponseDTO(result));
  };

  unfollowUser = async (req: Request, res: Response): Promise<void> => {
    const command = UnfollowUserCommand.from({
      followerId: String(requireAuthUserId(req)),
      followingId: req.params.id,
    });
    await this.commandBus.execute(command);
    res.status(204).send();
  };

  listFollowers = async (req: Request, res: Response): Promise<void> => {
    const query = ListFollowersQuery.from({ userId: req.params.id });
    const result = await this.queryBus.execute<ListFollowersQuery, IFollowUserSummaryDTO[]>(query);
    res.json(result);
  };

  listFollowing = async (req: Request, res: Response): Promise<void> => {
    const query = ListFollowingQuery.from({ userId: req.params.id });
    const result = await this.queryBus.execute<ListFollowingQuery, IFollowUserSummaryDTO[]>(query);
    res.json(result);
  };

  listProfileNotes = async (req: Request, res: Response): Promise<void> => {
    const query = ListProfileNotesQuery.from({ userId: req.params.id });
    const result = await this.queryBus.execute<ListProfileNotesQuery, INoteResponseDTO[]>(query);
    res.json(result);
  };
}
