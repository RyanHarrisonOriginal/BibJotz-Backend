process.env.NODE_ENV = 'test';

import assert from 'node:assert/strict';
import { Server } from 'http';
import { after, before, describe, it } from 'node:test';
import express, { NextFunction, Request, Response } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { GetUserQueryHandler } from '@/domain/User/queries/get-user/get-user-query.handler';
import { ListFollowersQueryHandler } from '@/domain/Follow/queries/list-followers/list-followers-query.handler';
import { ListFollowingQueryHandler } from '@/domain/Follow/queries/list-following/list-following-query.handler';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { userRoutes } from '@/infrastructure/http/routes/user.routes';
import { errorHandler } from '@/middleware/errorHandler';
import { UnauthorizedError } from '@/domain/shared/errors/unauthorized-error';
import { User } from '@/domain/User/user';

const NOW = new Date('2024-06-01T00:00:00.000Z');
const PRIVATE_USER = 10;
const PUBLIC_USER = 11;
const ACCEPTED = 20;
const PENDING = 21;
const STRANGER = 22;
const ACCEPTED_FOLLOWEE = 30;
const PENDING_FOLLOWEE = 31;

type FollowStatus = 'PENDING' | 'ACCEPTED';

type StoredUser = {
  id: number;
  displayName: string;
  clerkUserId: string | null;
  username: string | null;
  bio: string | null;
  followPolicy: 'APPROVAL';
  followListsPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type StoredFollow = {
  id: number;
  followerId: number;
  followingId: number;
  status: FollowStatus;
  createdAt: Date;
  follower: { id: number; displayName: string; username: string | null };
  following: { id: number; displayName: string; username: string | null };
};

function person(id: number, followListsPublic = false): StoredUser {
  return {
    id,
    displayName: `Reader ${id}`,
    clerkUserId: `clerk_${id}`,
    username: null,
    bio: null,
    followPolicy: 'APPROVAL',
    followListsPublic,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

class MemoryUsers {
  rows = new Map<number, StoredUser>();

  async findById(id: number): Promise<StoredUser | null> {
    return this.rows.get(id) ?? null;
  }
}

class MemoryFollows {
  rows: StoredFollow[] = [];

  async findByPair(followerId: number, followingId: number): Promise<StoredFollow | null> {
    return this.rows.find((row) => row.followerId === followerId && row.followingId === followingId) ?? null;
  }

  async findFollowers(userId: number): Promise<StoredFollow[]> {
    return this.rows.filter((row) => row.followingId === userId && row.status === 'ACCEPTED');
  }

  async findFollowing(userId: number): Promise<StoredFollow[]> {
    return this.rows.filter((row) => row.followerId === userId && row.status === 'ACCEPTED');
  }

  async countAcceptedFollowers(userId: number): Promise<number> {
    return (await this.findFollowers(userId)).length;
  }

  async countAcceptedFollowing(userId: number): Promise<number> {
    return (await this.findFollowing(userId)).length;
  }
}

function authHeader(userId: number): { Authorization: string } {
  return { Authorization: `Bearer test-user-${userId}` };
}

function testAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const match = typeof header === 'string' ? /^Bearer test-user-(\d+)$/.exec(header) : null;
  if (!match) {
    next(new UnauthorizedError('Missing Bearer token'));
    return;
  }
  const id = Number(match[1]);
  req.authUser = new User(id, `Reader ${id}`, `clerk_${id}`, null, null, NOW, NOW);
  next();
}

describe('follow lists and profile counts', { concurrency: false }, () => {
  let baseUrl = '';
  let server: Server;
  let errorLog: typeof console.error = console.error;

  before(async () => {
    errorLog = console.error;
    console.error = () => undefined;

    const users = new MemoryUsers();
    for (const id of [PRIVATE_USER, ACCEPTED, PENDING, STRANGER, ACCEPTED_FOLLOWEE, PENDING_FOLLOWEE]) {
      users.rows.set(id, person(id));
    }
    users.rows.set(PUBLIC_USER, person(PUBLIC_USER, true));

    const follows = new MemoryFollows();
    const link = (id: number, followerId: number, followingId: number, status: FollowStatus): StoredFollow => ({
      id,
      followerId,
      followingId,
      status,
      createdAt: NOW,
      follower: { id: followerId, displayName: `Reader ${followerId}`, username: null },
      following: { id: followingId, displayName: `Reader ${followingId}`, username: null },
    });
    follows.rows.push(link(1, ACCEPTED, PRIVATE_USER, 'ACCEPTED'));
    follows.rows.push(link(2, PENDING, PRIVATE_USER, 'PENDING'));
    follows.rows.push(link(3, PRIVATE_USER, ACCEPTED_FOLLOWEE, 'ACCEPTED'));
    follows.rows.push(link(4, PRIVATE_USER, PENDING_FOLLOWEE, 'PENDING'));
    follows.rows.push(link(5, STRANGER, PUBLIC_USER, 'PENDING'));
    follows.rows.push(link(6, ACCEPTED, PUBLIC_USER, 'ACCEPTED'));

    const queryBus = new QueryBus();
    const userRepo = users as unknown as IUserRepository;
    const followRepo = follows as unknown as IFollowRepository;
    queryBus.registerHandler('GetUserQuery', new GetUserQueryHandler(userRepo, followRepo));
    queryBus.registerHandler('ListFollowersQuery', new ListFollowersQueryHandler(followRepo, userRepo));
    queryBus.registerHandler('ListFollowingQuery', new ListFollowingQueryHandler(followRepo, userRepo));

    const app = express();
    app.use(express.json());
    const commandBus = new CommandBus();
    app.use('/api/v1/users', userRoutes(commandBus, queryBus, testAuth, testAuth));
    app.use(errorHandler);

    server = await new Promise<Server>((resolve) => {
      const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
    });
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    console.error = errorLog;
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  async function get(path: string, userId: number): Promise<{ status: number; body: unknown }> {
    const response = await fetch(`${baseUrl}${path}`, { headers: authHeader(userId) });
    return { status: response.status, body: await response.json() };
  }

  it('returns accepted counts on the profile for a stranger', async () => {
    const result = await get(`/api/v1/users/${PRIVATE_USER}`, STRANGER);
    assert.equal(result.status, 200);
    const body = result.body as { followerCount: number; followingCount: number; clerkUserId?: string };
    assert.equal(body.followerCount, 1);
    assert.equal(body.followingCount, 1);
    assert.equal('clerkUserId' in body, false);
  });

  it('private follower and following lists are readable by the owner and an accepted follower', async () => {
    for (const viewer of [PRIVATE_USER, ACCEPTED]) {
      const followers = await get(`/api/v1/users/${PRIVATE_USER}/followers`, viewer);
      const following = await get(`/api/v1/users/${PRIVATE_USER}/following`, viewer);
      assert.equal(followers.status, 200);
      assert.equal(following.status, 200);
      assert.deepEqual(
        (followers.body as { id: number }[]).map((row) => row.id),
        [ACCEPTED],
      );
      assert.deepEqual(
        (following.body as { id: number }[]).map((row) => row.id),
        [ACCEPTED_FOLLOWEE],
      );
    }
  });

  it('private lists are forbidden to a pending requester and a stranger', async () => {
    for (const viewer of [PENDING, STRANGER]) {
      const followers = await get(`/api/v1/users/${PRIVATE_USER}/followers`, viewer);
      const following = await get(`/api/v1/users/${PRIVATE_USER}/following`, viewer);
      const expected = { success: false, error: { message: 'Follow lists are private', statusCode: 403 } };
      assert.equal(followers.status, 403);
      assert.equal(following.status, 403);
      assert.deepEqual(followers.body, expected);
      assert.deepEqual(following.body, expected);
    }
  });

  it('public lists are readable by a stranger and still omit pending follows', async () => {
    const followers = await get(`/api/v1/users/${PUBLIC_USER}/followers`, STRANGER);
    assert.equal(followers.status, 200);
    assert.deepEqual(
      (followers.body as { id: number }[]).map((row) => row.id),
      [ACCEPTED],
    );
  });
});
