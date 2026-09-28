process.env.NODE_ENV = 'test';

import assert from 'node:assert/strict';
import { Server } from 'http';
import { after, before, beforeEach, describe, it } from 'node:test';
import express, { NextFunction, Request, Response } from 'express';
import { Prisma } from '@/generated/app-client';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { FollowUserCommandHandler } from '@/domain/Follow/commands/follow-user/follow-user-command.handler';
import { UnfollowUserCommandHandler } from '@/domain/Follow/commands/unfollow-user/unfollow-user-command.handler';
import { AcceptFollowRequestCommandHandler } from '@/domain/Follow/commands/accept-follow-request/accept-follow-request-command.handler';
import { DeclineFollowRequestCommandHandler } from '@/domain/Follow/commands/decline-follow-request/decline-follow-request-command.handler';
import { RemoveFollowerCommandHandler } from '@/domain/Follow/commands/remove-follower/remove-follower-command.handler';
import { UpdateFollowSettingsCommandHandler } from '@/domain/Follow/commands/update-follow-settings/update-follow-settings-command.handler';
import { ListFollowRequestsQueryHandler } from '@/domain/Follow/queries/list-follow-requests/list-follow-requests-query.handler';
import { GetUserQueryHandler } from '@/domain/User/queries/get-user/get-user-query.handler';
import { GetCurrentUserQueryHandler } from '@/domain/User/queries/get-current-user/get-current-user-query.handler';
import { GetNoteQueryHandler } from '@/domain/Note/queries/get-note/get-note-query.handler';
import { GetFeedQueryHandler } from '@/domain/Note/queries/get-feed/get-feed-query.handler';
import { FollowEvent, IFollowEventPublisher } from '@/domain/Follow/ports/follow-event-publisher.port';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { User } from '@/domain/User/user';
import { UserFollow } from '@/domain/Follow/user-follow';
import { FollowPolicy } from '@/domain/User/user';
import { NoteAudience } from '@/domain/Note/note-audience';
import { visibleNoteWhere } from '@/infrastructure/persistence/postgres/visible-note-where';
import { userRoutes } from '@/infrastructure/http/routes/user.routes';
import { noteRoutes } from '@/infrastructure/http/routes/note.routes';
import { errorHandler } from '@/middleware/errorHandler';
import { UnauthorizedError } from '@/domain/shared/errors/unauthorized-error';

const NOW = new Date('2024-06-01T00:00:00.000Z');
const VIEWER = 1;
const OPEN_USER = 2;
const APPROVAL_USER = 3;
const OTHER = 4;
const STRANGER_AUTHOR = 5;

type FollowStatus = 'PENDING' | 'ACCEPTED';

type StoredUser = {
  id: number;
  displayName: string;
  clerkUserId: string | null;
  username: string | null;
  bio: string | null;
  followPolicy: FollowPolicy;
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

type StoredNote = {
  id: number;
  userId: number;
  content: string;
  bookName: string;
  bookShortName: string;
  chapter: number | null;
  startVerse: number | null;
  endVerse: number | null;
  verseSpans: null;
  audience: NoteAudience;
  createdAt: Date;
  updatedAt: Date;
  references: [];
};

function person(id: number, followPolicy: FollowPolicy): StoredUser {
  return {
    id,
    displayName: `Reader ${id}`,
    clerkUserId: `clerk_${id}`,
    username: null,
    bio: null,
    followPolicy,
    followListsPublic: false,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

function note(id: number, userId: number, audience: NoteAudience): StoredNote {
  return {
    id,
    userId,
    content: `note-${id}`,
    bookName: 'John',
    bookShortName: 'Jn',
    chapter: 3,
    startVerse: 16,
    endVerse: 16,
    verseSpans: null,
    audience,
    createdAt: NOW,
    updatedAt: NOW,
    references: [],
  };
}

function matches(where: Prisma.NoteWhereInput, row: StoredNote, acceptedAuthors: Set<number>): boolean {
  if (where.AND) {
    const parts = Array.isArray(where.AND) ? where.AND : [where.AND];
    return parts.every((part) => matches(part, row, acceptedAuthors));
  }
  if (where.OR) {
    const parts = Array.isArray(where.OR) ? where.OR : [where.OR];
    return parts.some((part) => matches(part, row, acceptedAuthors));
  }
  if (where.NOT && !Array.isArray(where.NOT)) return !matches(where.NOT, row, acceptedAuthors);

  let ok = true;
  if (typeof where.userId === 'number') ok = ok && row.userId === where.userId;
  if (typeof where.audience === 'string') ok = ok && row.audience === where.audience;
  const followers =
    where.user && typeof where.user === 'object' && 'followers' in where.user ? where.user.followers : undefined;
  if (followers && typeof followers === 'object' && 'some' in followers && followers.some) {
    ok = ok && followers.some.status === 'ACCEPTED' && acceptedAuthors.has(row.userId);
  }
  return ok;
}

class RecordingPublisher implements IFollowEventPublisher {
  events: FollowEvent[] = [];

  async publish(event: FollowEvent): Promise<void> {
    this.events.push(event);
  }
}

class Memory {
  users = new Map<number, StoredUser>();
  follows: StoredFollow[] = [];
  notes = new Map<number, StoredNote>();
  nextFollowId = 1;
  settingsSaves = 0;
  publisher = new RecordingPublisher();

  reset(): void {
    this.follows = [];
    this.nextFollowId = 1;
    this.settingsSaves = 0;
    this.publisher.events = [];
    this.users.set(VIEWER, person(VIEWER, 'APPROVAL'));
    this.users.set(OPEN_USER, person(OPEN_USER, 'OPEN'));
    this.users.set(APPROVAL_USER, person(APPROVAL_USER, 'APPROVAL'));
    this.users.set(OTHER, person(OTHER, 'APPROVAL'));
    this.users.set(STRANGER_AUTHOR, person(STRANGER_AUTHOR, 'OPEN'));
  }

  acceptedAuthors(viewerId: number): Set<number> {
    return new Set(
      this.follows
        .filter((row) => row.followerId === viewerId && row.status === 'ACCEPTED')
        .map((row) => row.followingId),
    );
  }

  summary(id: number) {
    const user = this.users.get(id);
    return { id, displayName: user?.displayName ?? `Reader ${id}`, username: user?.username ?? null };
  }
}

function repos(memory: Memory) {
  const follows = {
    async save(follow: UserFollow) {
      const id = follow.getId();
      if (!id) {
        const row: StoredFollow = {
          id: memory.nextFollowId++,
          followerId: follow.getFollowerId(),
          followingId: follow.getFollowingId(),
          status: follow.getStatus(),
          createdAt: follow.getCreatedAt(),
          follower: memory.summary(follow.getFollowerId()),
          following: memory.summary(follow.getFollowingId()),
        };
        memory.follows.push(row);
        return row;
      }
      const row = memory.follows.find((item) => item.id === id);
      if (!row) throw new Error('missing follow');
      row.status = follow.getStatus();
      return row;
    },
    async findByPair(followerId: number, followingId: number) {
      return memory.follows.find((row) => row.followerId === followerId && row.followingId === followingId) ?? null;
    },
    async deleteByPair(followerId: number, followingId: number) {
      memory.follows = memory.follows.filter(
        (row) => !(row.followerId === followerId && row.followingId === followingId),
      );
    },
    async findFollowers(userId: number) {
      return memory.follows.filter((row) => row.followingId === userId && row.status === 'ACCEPTED');
    },
    async findFollowing(userId: number) {
      return memory.follows.filter((row) => row.followerId === userId && row.status === 'ACCEPTED');
    },
    async countAcceptedFollowers(userId: number) {
      return (await this.findFollowers(userId)).length;
    },
    async countAcceptedFollowing(userId: number) {
      return (await this.findFollowing(userId)).length;
    },
    async countPendingRequests(followeeId: number) {
      return memory.follows.filter((row) => row.followingId === followeeId && row.status === 'PENDING').length;
    },
    async findIncomingPending(
      followeeId: number,
      options: { limit: number; cursor?: { createdAt: Date; id: number } },
    ) {
      const cursor = options.cursor;
      return memory.follows
        .filter((row) => row.followingId === followeeId && row.status === 'PENDING')
        .filter((row) => {
          if (!cursor) return true;
          if (row.createdAt < cursor.createdAt) return true;
          return row.createdAt.getTime() === cursor.createdAt.getTime() && row.id < cursor.id;
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id)
        .slice(0, options.limit);
    },
  };

  const users = {
    async findById(id: number) {
      return memory.users.get(id) ?? null;
    },
    async saveFollowSettings(user: User, acceptPendingRequests: boolean) {
      memory.settingsSaves += 1;
      const id = user.getId() ?? 0;
      const stored = memory.users.get(id);
      if (!stored) throw new Error('missing user');
      stored.followPolicy = user.getFollowPolicy();
      stored.followListsPublic = user.getFollowListsPublic();
      const acceptedFollowerIds: number[] = [];
      if (acceptPendingRequests) {
        for (const row of memory.follows) {
          if (row.followingId === id && row.status === 'PENDING') {
            row.status = 'ACCEPTED';
            acceptedFollowerIds.push(row.followerId);
          }
        }
      }
      return { raw: stored, acceptedFollowerIds };
    },
  };

  const notes = {
    async findById(id: number) {
      return memory.notes.get(id) ?? null;
    },
    async findFeedForUser(filters: { viewerUserId: number; limit?: number }) {
      const accepted = memory.acceptedAuthors(filters.viewerUserId);
      const where: Prisma.NoteWhereInput = {
        AND: [
          { NOT: { userId: filters.viewerUserId } },
          {
            user: {
              followers: { some: { followerId: filters.viewerUserId, status: 'ACCEPTED' } },
            },
          },
          visibleNoteWhere(filters.viewerUserId),
        ],
      };
      return [...memory.notes.values()]
        .filter((row) => matches(where, row, accepted))
        .slice(0, filters.limit ?? 50);
    },
  };

  return { follows, users, notes };
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

describe('follow flow and feed', { concurrency: false }, () => {
  const memory = new Memory();
  let baseUrl = '';
  let server: Server;
  let errorLog: typeof console.error = console.error;

  before(async () => {
    errorLog = console.error;
    console.error = () => undefined;
    memory.notes.set(101, note(101, OPEN_USER, 'FOLLOWERS'));
    memory.notes.set(201, note(201, APPROVAL_USER, 'FOLLOWERS'));
    memory.notes.set(202, note(202, APPROVAL_USER, 'PUBLIC'));
    memory.notes.set(203, note(203, APPROVAL_USER, 'PRIVATE'));
    memory.notes.set(301, note(301, STRANGER_AUTHOR, 'PUBLIC'));
    memory.notes.set(401, note(401, VIEWER, 'PUBLIC'));

    const { follows, users, notes } = repos(memory);
    const commandBus = new CommandBus();
    const queryBus = new QueryBus();
    const followRepo = follows as unknown as IFollowRepository;
    const userRepo = users as unknown as IUserRepository;
    const noteRepo = notes as unknown as INoteRepository;
    commandBus.registerHandler(
      'FollowUserCommand',
      new FollowUserCommandHandler(followRepo, userRepo, memory.publisher),
    );
    commandBus.registerHandler('UnfollowUserCommand', new UnfollowUserCommandHandler(followRepo, memory.publisher));
    commandBus.registerHandler(
      'AcceptFollowRequestCommand',
      new AcceptFollowRequestCommandHandler(followRepo, memory.publisher),
    );
    commandBus.registerHandler(
      'DeclineFollowRequestCommand',
      new DeclineFollowRequestCommandHandler(followRepo, memory.publisher),
    );
    commandBus.registerHandler(
      'RemoveFollowerCommand',
      new RemoveFollowerCommandHandler(followRepo, memory.publisher),
    );
    commandBus.registerHandler(
      'UpdateFollowSettingsCommand',
      new UpdateFollowSettingsCommandHandler(userRepo, memory.publisher),
    );
    queryBus.registerHandler('ListFollowRequestsQuery', new ListFollowRequestsQueryHandler(followRepo));
    queryBus.registerHandler('GetUserQuery', new GetUserQueryHandler(userRepo, followRepo));
    queryBus.registerHandler('GetCurrentUserQuery', new GetCurrentUserQueryHandler(userRepo, followRepo));
    queryBus.registerHandler('GetNoteQuery', new GetNoteQueryHandler(noteRepo, followRepo));
    queryBus.registerHandler('GetFeedQuery', new GetFeedQueryHandler(noteRepo));

    const app = express();
    app.use(express.json());
    app.use(testAuth);
    app.use('/api/v1/users', userRoutes(commandBus, queryBus, testAuth, testAuth));
    app.use('/api/v1/notes', noteRoutes(commandBus, queryBus));
    app.use(errorHandler);

    server = await new Promise<Server>((resolve) => {
      const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
    });
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  beforeEach(() => {
    memory.reset();
  });

  after(async () => {
    console.error = errorLog;
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  function headers(userId: number, json = false): Record<string, string> {
    return {
      Authorization: `Bearer test-user-${userId}`,
      ...(json ? { 'content-type': 'application/json' } : {}),
    };
  }

  async function follow(actor: number, target: number) {
    const response = await fetch(`${baseUrl}/api/v1/users/${target}/follow`, {
      method: 'POST',
      headers: headers(actor),
    });
    const body = await response.json();
    return { status: response.status, body };
  }

  async function getNote(actor: number, id: number) {
    const response = await fetch(`${baseUrl}/api/v1/notes/${id}`, { headers: headers(actor) });
    return { status: response.status, body: await response.json() };
  }

  async function feedIds(actor: number): Promise<number[]> {
    const response = await fetch(`${baseUrl}/api/v1/notes/feed`, { headers: headers(actor) });
    assert.equal(response.status, 200);
    const body = (await response.json()) as { id: number }[];
    return body.map((row) => row.id).sort((a, b) => a - b);
  }

  it('following an OPEN account is accepted and can read followers notes', async () => {
    const created = await follow(VIEWER, OPEN_USER);
    assert.equal(created.status, 201);
    assert.equal(created.body.status, 'ACCEPTED');
    assert.equal((await getNote(VIEWER, 101)).status, 200);
    assert.deepEqual(await feedIds(VIEWER), [101]);
    assert.equal(memory.publisher.events[0]?.type, 'FollowAccepted');
  });

  it('a stranger public note stays out of the feed', async () => {
    await follow(VIEWER, OPEN_USER);
    assert.equal((await feedIds(VIEWER)).includes(301), false);
    assert.equal((await feedIds(VIEWER)).includes(401), false);
  });

  it('following an APPROVAL account is pending until accepted', async () => {
    const created = await follow(VIEWER, APPROVAL_USER);
    assert.equal(created.status, 201);
    assert.equal(created.body.status, 'PENDING');
    assert.equal((await getNote(VIEWER, 201)).status, 404);
    assert.deepEqual(await feedIds(VIEWER), []);
    assert.equal(memory.publisher.events[0]?.type, 'FollowRequested');

    const profile = await fetch(`${baseUrl}/api/v1/users/${APPROVAL_USER}`, { headers: headers(VIEWER) });
    const profileBody = await profile.json();
    assert.equal(profileBody.viewerFollowStatus, 'PENDING');
    assert.equal(profileBody.followPolicy, 'APPROVAL');

    const accepted = await fetch(`${baseUrl}/api/v1/users/me/follow-requests/${VIEWER}/accept`, {
      method: 'POST',
      headers: headers(APPROVAL_USER),
    });
    const acceptedBody = await accepted.json();
    assert.equal(accepted.status, 200);
    assert.equal(acceptedBody.status, 'ACCEPTED');
    assert.equal((await getNote(VIEWER, 201)).status, 200);
    assert.deepEqual(await feedIds(VIEWER), [201, 202]);
    assert.equal((await feedIds(VIEWER)).includes(203), false);

    const after = await fetch(`${baseUrl}/api/v1/users/${APPROVAL_USER}`, { headers: headers(VIEWER) });
    assert.equal((await after.json()).viewerFollowStatus, 'ACCEPTED');
  });

  it('viewerFollowStatus is NONE before a follow exists', async () => {
    const response = await fetch(`${baseUrl}/api/v1/users/${APPROVAL_USER}`, { headers: headers(VIEWER) });
    const body = await response.json();
    assert.equal(body.viewerFollowStatus, 'NONE');
  });

  it('a second follow request keeps the single pending row', async () => {
    const first = await follow(VIEWER, APPROVAL_USER);
    const second = await follow(VIEWER, APPROVAL_USER);
    assert.equal(second.status, 200);
    assert.equal(second.body.status, 'PENDING');
    assert.equal(second.body.id, first.body.id);
    assert.equal(memory.follows.length, 1);
    assert.equal(memory.publisher.events.length, 1);
  });

  it('self-follow is rejected', async () => {
    const response = await fetch(`${baseUrl}/api/v1/users/${VIEWER}/follow`, {
      method: 'POST',
      headers: headers(VIEWER),
    });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.match(body.error.message, /yourself/);
  });

  it('decline removes the request and allows a new one', async () => {
    await follow(VIEWER, APPROVAL_USER);
    const decline = await fetch(`${baseUrl}/api/v1/users/me/follow-requests/${VIEWER}/decline`, {
      method: 'POST',
      headers: headers(APPROVAL_USER),
    });
    assert.equal(decline.status, 204);
    assert.equal(memory.follows.length, 0);
    assert.equal(memory.publisher.events.at(-1)?.type, 'FollowRemoved');
    assert.equal(
      memory.publisher.events.at(-1)?.type === 'FollowRemoved'
        ? memory.publisher.events.at(-1)?.reason
        : undefined,
      'decline',
    );

    const again = await follow(VIEWER, APPROVAL_USER);
    assert.equal(again.status, 201);
    assert.equal(again.body.status, 'PENDING');
  });

  it('removing a follower revokes followers-note access on the next read', async () => {
    await follow(VIEWER, OPEN_USER);
    assert.equal((await getNote(VIEWER, 101)).status, 200);
    const removed = await fetch(`${baseUrl}/api/v1/users/me/followers/${VIEWER}`, {
      method: 'DELETE',
      headers: headers(OPEN_USER),
    });
    assert.equal(removed.status, 204);
    assert.equal((await getNote(VIEWER, 101)).status, 404);
    const again = await fetch(`${baseUrl}/api/v1/users/me/followers/${VIEWER}`, {
      method: 'DELETE',
      headers: headers(OPEN_USER),
    });
    assert.equal(again.status, 204);
  });

  it('unfollow revokes followers-note access and drops the author from the feed', async () => {
    await follow(VIEWER, APPROVAL_USER);
    await fetch(`${baseUrl}/api/v1/users/me/follow-requests/${VIEWER}/accept`, {
      method: 'POST',
      headers: headers(APPROVAL_USER),
    });
    assert.deepEqual(await feedIds(VIEWER), [201, 202]);

    const removed = await fetch(`${baseUrl}/api/v1/users/${APPROVAL_USER}/follow`, {
      method: 'DELETE',
      headers: headers(VIEWER),
    });
    assert.equal(removed.status, 204);
    assert.equal((await getNote(VIEWER, 201)).status, 404);
    assert.deepEqual(await feedIds(VIEWER), []);

    const again = await fetch(`${baseUrl}/api/v1/users/${APPROVAL_USER}/follow`, {
      method: 'DELETE',
      headers: headers(VIEWER),
    });
    assert.equal(again.status, 204);
  });

  it('pending follow notes stay out of the feed, including public notes', async () => {
    await follow(VIEWER, APPROVAL_USER);
    assert.deepEqual(await feedIds(VIEWER), []);
  });

  it('only the target can see and accept their requests', async () => {
    await follow(VIEWER, APPROVAL_USER);
    const outsider = await fetch(`${baseUrl}/api/v1/users/me/follow-requests/${VIEWER}/accept`, {
      method: 'POST',
      headers: headers(OTHER),
    });
    const outsiderBody = await outsider.json();
    assert.equal(outsider.status, 404);
    assert.equal(outsiderBody.error.message, 'Follow request not found');

    const theirs = await fetch(`${baseUrl}/api/v1/users/me/follow-requests`, { headers: headers(APPROVAL_USER) });
    const theirsBody = await theirs.json();
    assert.deepEqual(
      theirsBody.requests.map((row: { followerId: number }) => row.followerId),
      [VIEWER],
    );
    const others = await fetch(`${baseUrl}/api/v1/users/me/follow-requests`, { headers: headers(OTHER) });
    assert.deepEqual((await others.json()).requests, []);
  });

  it('lists incoming requests newest first with a keyset cursor', async () => {
    const older = new Date('2024-01-01T00:00:00.000Z');
    const middle = new Date('2024-02-01T00:00:00.000Z');
    const newer = new Date('2024-03-01T00:00:00.000Z');
    memory.follows.push(
      {
        id: 1,
        followerId: VIEWER,
        followingId: APPROVAL_USER,
        status: 'PENDING',
        createdAt: older,
        follower: memory.summary(VIEWER),
        following: memory.summary(APPROVAL_USER),
      },
      {
        id: 2,
        followerId: OTHER,
        followingId: APPROVAL_USER,
        status: 'PENDING',
        createdAt: middle,
        follower: memory.summary(OTHER),
        following: memory.summary(APPROVAL_USER),
      },
      {
        id: 3,
        followerId: STRANGER_AUTHOR,
        followingId: APPROVAL_USER,
        status: 'PENDING',
        createdAt: newer,
        follower: memory.summary(STRANGER_AUTHOR),
        following: memory.summary(APPROVAL_USER),
      },
    );

    const first = await fetch(`${baseUrl}/api/v1/users/me/follow-requests?limit=2`, {
      headers: headers(APPROVAL_USER),
    });
    const firstBody = await first.json();
    assert.deepEqual(
      firstBody.requests.map((row: { id: number }) => row.id),
      [3, 2],
    );
    const cursor = firstBody.nextCursor;
    const second = await fetch(
      `${baseUrl}/api/v1/users/me/follow-requests?limit=2&cursorCreatedAt=${encodeURIComponent(cursor.createdAt)}&cursorId=${cursor.id}`,
      { headers: headers(APPROVAL_USER) },
    );
    const secondBody = await second.json();
    assert.deepEqual(
      secondBody.requests.map((row: { id: number }) => row.id),
      [1],
    );
    assert.equal(secondBody.nextCursor, null);
  });

  it('opening an approval account accepts every pending request in one save', async () => {
    await follow(VIEWER, APPROVAL_USER);
    await follow(OTHER, APPROVAL_USER);
    await follow(STRANGER_AUTHOR, APPROVAL_USER);
    memory.publisher.events = [];

    const response = await fetch(`${baseUrl}/api/v1/users/me/follow-settings`, {
      method: 'PATCH',
      headers: headers(APPROVAL_USER, true),
      body: JSON.stringify({ followPolicy: 'OPEN' }),
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.followPolicy, 'OPEN');
    assert.equal(body.followListsPublic, false);
    assert.equal(memory.settingsSaves, 1);
    assert.deepEqual(
      memory.follows.map((row) => row.status),
      ['ACCEPTED', 'ACCEPTED', 'ACCEPTED'],
    );
    assert.equal(memory.publisher.events.filter((event) => event.type === 'FollowPolicyChanged').length, 1);
    assert.equal(memory.publisher.events.filter((event) => event.type === 'FollowAccepted').length, 3);

    const me = await fetch(`${baseUrl}/api/v1/users/me`, { headers: headers(APPROVAL_USER) });
    const meBody = await me.json();
    assert.equal(meBody.pendingRequestCount, 0);
    assert.equal(meBody.followPolicy, 'OPEN');
    assert.equal(meBody.followListsPublic, false);
  });

  it('switching to approval leaves accepted follows in place', async () => {
    await follow(VIEWER, OPEN_USER);
    const response = await fetch(`${baseUrl}/api/v1/users/me/follow-settings`, {
      method: 'PATCH',
      headers: headers(OPEN_USER, true),
      body: JSON.stringify({ followPolicy: 'APPROVAL' }),
    });
    assert.equal((await response.json()).followPolicy, 'APPROVAL');
    assert.equal(memory.follows[0]?.status, 'ACCEPTED');
    const next = await follow(OTHER, OPEN_USER);
    assert.equal(next.body.status, 'PENDING');
  });
});
