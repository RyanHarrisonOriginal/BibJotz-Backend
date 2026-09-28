import { Request, Response } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { User } from '@/domain/User/user';
import { UserMapper } from '@/domain/User/user.mapper';
import { CreateUserCommand } from '@/domain/User/commands/create-user/create-user.command';
import { UpdateUserCommand } from '@/domain/User/commands/update-user/update-user.command';
import { GetUserQuery } from '@/domain/User/queries/get-user/get-user.query';
import { IUserProfile } from '@/domain/User/queries/get-user/get-user-query.handler';
import { GetCurrentUserQuery } from '@/domain/User/queries/get-current-user/get-current-user.query';
import { ICurrentUser } from '@/domain/User/queries/get-current-user/get-current-user-query.handler';
import { UserFollow } from '@/domain/Follow/user-follow';
import { FollowMapper } from '@/domain/Follow/follow.mapper';
import { IFollowRequestListDTO, IFollowUserSummaryDTO } from '@/domain/Follow/follow.dto';
import { FollowUserCommand } from '@/domain/Follow/commands/follow-user/follow-user.command';
import { IFollowUserResult } from '@/domain/Follow/commands/follow-user/follow-user-command.handler';
import { UnfollowUserCommand } from '@/domain/Follow/commands/unfollow-user/unfollow-user.command';
import { AcceptFollowRequestCommand } from '@/domain/Follow/commands/accept-follow-request/accept-follow-request.command';
import { DeclineFollowRequestCommand } from '@/domain/Follow/commands/decline-follow-request/decline-follow-request.command';
import { RemoveFollowerCommand } from '@/domain/Follow/commands/remove-follower/remove-follower.command';
import { UpdateFollowSettingsCommand } from '@/domain/Follow/commands/update-follow-settings/update-follow-settings.command';
import { ListFollowersQuery } from '@/domain/Follow/queries/list-followers/list-followers.query';
import { ListFollowingQuery } from '@/domain/Follow/queries/list-following/list-following.query';
import { ListFollowRequestsQuery } from '@/domain/Follow/queries/list-follow-requests/list-follow-requests.query';
import { ListProfileNotesQuery } from '@/domain/Note/queries/list-profile-notes/list-profile-notes.query';
import { INoteResponseDTO } from '@/domain/Note/note.dto';
import { UnauthorizedError } from '@/domain/shared/errors/unauthorized-error';
import { ForbiddenError } from '@/domain/shared/errors/forbidden-error';
import { requireAuthUserId } from '@/middleware/auth';

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
    const query = GetCurrentUserQuery.from(requireAuthUserId(req));
    const result = await this.queryBus.execute<GetCurrentUserQuery, ICurrentUser>(query);
    res.json(UserMapper.mapUserToMeResponseDTO(result.user, result.pendingRequestCount));
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
    const query = GetUserQuery.from({
      id: req.params.id,
      viewerUserId: String(requireAuthUserId(req)),
    });
    const result = await this.queryBus.execute<GetUserQuery, IUserProfile>(query);
    res.json(
      UserMapper.mapUserToProfileResponseDTO(
        result.user,
        result.followerCount,
        result.followingCount,
        result.viewerFollowStatus,
      ),
    );
  };

  followUser = async (req: Request, res: Response): Promise<void> => {
    const command = FollowUserCommand.from({
      followerId: requireAuthUserId(req),
      followingId: req.params.id,
    });
    const result = await this.commandBus.execute<FollowUserCommand, IFollowUserResult>(command);
    res.status(result.created ? 201 : 200).json(FollowMapper.mapFollowToResponseDTO(result.follow));
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
    const query = ListFollowersQuery.from({
      userId: req.params.id,
      viewerUserId: String(requireAuthUserId(req)),
    });
    const result = await this.queryBus.execute<ListFollowersQuery, IFollowUserSummaryDTO[]>(query);
    res.json(result);
  };

  listFollowing = async (req: Request, res: Response): Promise<void> => {
    const query = ListFollowingQuery.from({
      userId: req.params.id,
      viewerUserId: String(requireAuthUserId(req)),
    });
    const result = await this.queryBus.execute<ListFollowingQuery, IFollowUserSummaryDTO[]>(query);
    res.json(result);
  };

  listProfileNotes = async (req: Request, res: Response): Promise<void> => {
    const query = ListProfileNotesQuery.from({
      userId: req.params.id,
      viewerUserId: String(requireAuthUserId(req)),
    });
    const result = await this.queryBus.execute<ListProfileNotesQuery, INoteResponseDTO[]>(query);
    res.json(result);
  };

  listFollowRequests = async (req: Request, res: Response): Promise<void> => {
    const query = ListFollowRequestsQuery.from({
      userId: String(requireAuthUserId(req)),
      limit: req.query.limit as string | string[] | undefined,
      cursorCreatedAt: req.query.cursorCreatedAt as string | string[] | undefined,
      cursorId: req.query.cursorId as string | string[] | undefined,
    });
    const result = await this.queryBus.execute<ListFollowRequestsQuery, IFollowRequestListDTO>(query);
    res.json(result);
  };

  acceptFollowRequest = async (req: Request, res: Response): Promise<void> => {
    const command = AcceptFollowRequestCommand.from({
      followeeId: requireAuthUserId(req),
      followerId: req.params.followerId,
    });
    const result = await this.commandBus.execute<AcceptFollowRequestCommand, UserFollow>(command);
    res.json(FollowMapper.mapFollowToResponseDTO(result));
  };

  declineFollowRequest = async (req: Request, res: Response): Promise<void> => {
    const command = DeclineFollowRequestCommand.from({
      followeeId: requireAuthUserId(req),
      followerId: req.params.followerId,
    });
    await this.commandBus.execute(command);
    res.status(204).send();
  };

  removeFollower = async (req: Request, res: Response): Promise<void> => {
    const command = RemoveFollowerCommand.from({
      followeeId: requireAuthUserId(req),
      followerId: req.params.followerId,
    });
    await this.commandBus.execute(command);
    res.status(204).send();
  };

  updateFollowSettings = async (req: Request, res: Response): Promise<void> => {
    const command = UpdateFollowSettingsCommand.from({
      userId: requireAuthUserId(req),
      followPolicy: req.body?.followPolicy,
      followListsPublic: req.body?.followListsPublic,
    });
    const result = await this.commandBus.execute<UpdateFollowSettingsCommand, User>(command);
    res.json({
      followPolicy: result.getFollowPolicy(),
      followListsPublic: result.getFollowListsPublic(),
    });
  };
}
