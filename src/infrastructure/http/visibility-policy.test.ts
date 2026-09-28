process.env.NODE_ENV = 'test';

import assert from 'node:assert/strict';
import { Server } from 'http';
import { after, before, describe, it } from 'node:test';
import express, { NextFunction, Request, Response } from 'express';
import { Prisma } from '@/generated/app-client';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { GetNoteQueryHandler } from '@/domain/Note/queries/get-note/get-note-query.handler';
import { GetReferenceQueryHandler } from '@/domain/Reference/queries/get-reference/get-reference-query.handler';
import { ListCommentsQueryHandler } from '@/domain/Comment/queries/list-comments/list-comments-query.handler';
import { ListProfileNotesQueryHandler } from '@/domain/Note/queries/list-profile-notes/list-profile-notes-query.handler';
import { GetFeedQueryHandler } from '@/domain/Note/queries/get-feed/get-feed-query.handler';
import { SearchQueryHandler } from '@/domain/Search/queries/search/search-query.handler';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { ICommentRepository } from '@/domain/Comment/comment-repository.interface';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { NoteAudience } from '@/domain/Note/note-audience';
import { visibleNoteWhere } from '@/infrastructure/persistence/postgres/visible-note-where';
import { noteRoutes } from '@/infrastructure/http/routes/note.routes';
import { referenceRoutes } from '@/infrastructure/http/routes/reference.routes';
import { searchRoutes } from '@/infrastructure/http/routes/search.routes';
import { userRoutes } from '@/infrastructure/http/routes/user.routes';
import { errorHandler } from '@/middleware/errorHandler';
import { UnauthorizedError } from '@/domain/shared/errors/unauthorized-error';
import { User } from '@/domain/User/user';

const NOW = new Date('2024-06-01T00:00:00.000Z');
const OWNER = 10;
const ACCEPTED = 20;
const PENDING = 21;
const STRANGER = 22;
const TOKEN = 'visibility-matrix';

type Audience = NoteAudience;
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
  audience: Audience;
  createdAt: Date;
  updatedAt: Date;
  references: Array<{
    reference: {
      id: number;
      title: string;
      author: string | null;
      typeId: number;
      type: { id: number; name: string };
    };
  }>;
};

type FollowStatus = 'PENDING' | 'ACCEPTED';

function matches(where: Prisma.NoteWhereInput, note: StoredNote, acceptedAuthors: Set<number>): boolean {
  if (where.AND) {
    const parts = Array.isArray(where.AND) ? where.AND : [where.AND];
    return parts.every((part) => matches(part, note, acceptedAuthors));
  }
  if (where.OR) {
    const parts = Array.isArray(where.OR) ? where.OR : [where.OR];
    return parts.some((part) => matches(part, note, acceptedAuthors));
  }
  if (where.NOT && !Array.isArray(where.NOT)) {
    return !matches(where.NOT, note, acceptedAuthors);
  }

  let ok = true;
  if (typeof where.userId === 'number') ok = ok && note.userId === where.userId;
  if (typeof where.audience === 'string') ok = ok && note.audience === where.audience;
  const followers =
    where.user && typeof where.user === 'object' && 'followers' in where.user ? where.user.followers : undefined;
  if (followers && typeof followers === 'object' && 'some' in followers && followers.some) {
    ok = ok && followers.some.status === 'ACCEPTED' && acceptedAuthors.has(note.userId);
  }
  for (const field of ['content', 'bookName', 'bookShortName'] as const) {
    const filter = where[field];
    if (filter && typeof filter === 'object' && 'contains' in filter) {
      ok = ok && note[field].toLowerCase().includes(String(filter.contains).toLowerCase());
    }
  }
  return ok;
}

class MemoryNotes {
  rows = new Map<number, StoredNote>();
  follows = new Map<string, FollowStatus>();

  acceptedAuthors(viewerId: number): Set<number> {
    const authors = new Set<number>();
    for (const [key, status] of this.follows) {
      if (status !== 'ACCEPTED') continue;
      const [follower, author] = key.split(':').map(Number);
      if (follower === viewerId) authors.add(author);
    }
    return authors;
  }

  async findById(id: number): Promise<StoredNote | null> {
    return this.rows.get(id) ?? null;
  }

  async findManyByReferenceId(referenceId: number): Promise<StoredNote[]> {
    return [...this.rows.values()].filter((note) =>
      note.references.some((tag) => tag.reference.id === referenceId),
    );
  }

  async findVisibleProfileNotes(filters: { authorUserId: number; viewerUserId: number }): Promise<StoredNote[]> {
    const where: Prisma.NoteWhereInput = {
      AND: [{ userId: filters.authorUserId }, visibleNoteWhere(filters.viewerUserId)],
    };
    return [...this.rows.values()].filter((note) =>
      matches(where, note, this.acceptedAuthors(filters.viewerUserId)),
    );
  }

  async findFeedForUser(filters: { viewerUserId: number; limit?: number }): Promise<StoredNote[]> {
    const where: Prisma.NoteWhereInput = {
      AND: [
        { NOT: { userId: filters.viewerUserId } },
        {
          user: {
            followers: {
              some: { followerId: filters.viewerUserId, status: 'ACCEPTED' },
            },
          },
        },
        visibleNoteWhere(filters.viewerUserId),
      ],
    };
    return [...this.rows.values()]
      .filter((note) => matches(where, note, this.acceptedAuthors(filters.viewerUserId)))
      .slice(0, filters.limit ?? 50);
  }

  async searchVisible(filters: { viewerUserId: number; query: string; limit: number }): Promise<StoredNote[]> {
    const q = filters.query.trim();
    const where: Prisma.NoteWhereInput = {
      AND: [
        visibleNoteWhere(filters.viewerUserId),
        {
          OR: [
            { content: { contains: q, mode: 'insensitive' } },
            { bookName: { contains: q, mode: 'insensitive' } },
            { bookShortName: { contains: q, mode: 'insensitive' } },
          ],
        },
      ],
    };
    return [...this.rows.values()]
      .filter((note) => matches(where, note, this.acceptedAuthors(filters.viewerUserId)))
      .slice(0, filters.limit);
  }
}

class MemoryFollows {
  constructor(private readonly notes: MemoryNotes) {}

  async findByPair(followerId: number, followingId: number): Promise<{ id: number; status: FollowStatus } | null> {
    const status = this.notes.follows.get(`${followerId}:${followingId}`);
    return status ? { id: 1, status } : null;
  }
}

class MemoryReferences {
  rows = new Map<
    number,
    {
      id: number;
      userId: number;
      typeId: number;
      title: string;
      normalizedTitle: string;
      author: string | null;
      createdAt: Date;
      updatedAt: Date;
      type: { name: string };
    }
  >();

  async findById(id: number) {
    return this.rows.get(id) ?? null;
  }
}

function note(id: number, audience: Audience, referenceId: number): StoredNote {
  return {
    id,
    userId: OWNER,
    content: `${TOKEN} ${audience}`,
    bookName: 'John',
    bookShortName: 'Jn',
    chapter: 3,
    startVerse: 16,
    endVerse: 16,
    verseSpans: null,
    audience,
    createdAt: NOW,
    updatedAt: NOW,
    references: [
      {
        reference: {
          id: referenceId,
          title: audience,
          author: null,
          typeId: 1,
          type: { id: 1, name: 'Commentary' },
        },
      },
    ],
  };
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

const viewers = [
  { role: 'owner', id: OWNER },
  { role: 'accepted follower', id: ACCEPTED },
  { role: 'pending requester', id: PENDING },
  { role: 'stranger', id: STRANGER },
] as const;

const notesByAudience: { audience: Audience; noteId: number; referenceId: number }[] = [
  { audience: 'PRIVATE', noteId: 1, referenceId: 101 },
  { audience: 'FOLLOWERS', noteId: 2, referenceId: 102 },
  { audience: 'PUBLIC', noteId: 3, referenceId: 103 },
];

function canRead(role: string, audience: Audience): boolean {
  if (role === 'owner') return true;
  if (audience === 'PUBLIC') return true;
  return audience === 'FOLLOWERS' && role === 'accepted follower';
}

describe('visibility policy matrix', { concurrency: false }, () => {
  let baseUrl = '';
  let server: Server;
  let errorLog: typeof console.error = console.error;

  before(async () => {
    errorLog = console.error;
    console.error = () => undefined;

    const notes = new MemoryNotes();
    notes.follows.set(`${ACCEPTED}:${OWNER}`, 'ACCEPTED');
    notes.follows.set(`${PENDING}:${OWNER}`, 'PENDING');
    for (const item of notesByAudience) {
      notes.rows.set(item.noteId, note(item.noteId, item.audience, item.referenceId));
    }
    const follows = new MemoryFollows(notes);
    const references = new MemoryReferences();
    for (const item of notesByAudience) {
      references.rows.set(item.referenceId, {
        id: item.referenceId,
        userId: OWNER,
        typeId: 1,
        title: item.audience,
        normalizedTitle: item.audience.toLowerCase(),
        author: null,
        createdAt: NOW,
        updatedAt: NOW,
        type: { name: 'Commentary' },
      });
    }
    const comments = { async findByNoteId() { return []; } };
    const users = { async search() { return []; } };

    const queryBus = new QueryBus();
    const noteRepo = notes as unknown as INoteRepository;
    const followRepo = follows as unknown as IFollowRepository;
    queryBus.registerHandler('GetNoteQuery', new GetNoteQueryHandler(noteRepo, followRepo));
    queryBus.registerHandler(
      'GetReferenceQuery',
      new GetReferenceQueryHandler(references as unknown as IReferenceRepository, noteRepo, followRepo),
    );
    queryBus.registerHandler(
      'ListCommentsQuery',
      new ListCommentsQueryHandler(comments as unknown as ICommentRepository, noteRepo, followRepo),
    );
    queryBus.registerHandler('ListProfileNotesQuery', new ListProfileNotesQueryHandler(noteRepo));
    queryBus.registerHandler('GetFeedQuery', new GetFeedQueryHandler(noteRepo));
    queryBus.registerHandler(
      'SearchQuery',
      new SearchQueryHandler(users as unknown as IUserRepository, noteRepo),
    );

    const app = express();
    app.use(express.json());
    app.use(testAuth);
    const commandBus = new CommandBus();
    app.use('/api/v1/notes', noteRoutes(commandBus, queryBus));
    app.use('/api/v1/references', referenceRoutes(commandBus, queryBus));
    app.use('/api/v1/search', searchRoutes(queryBus));
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
    const body = await response.json();
    return { status: response.status, body };
  }

  for (const viewer of viewers) {
    for (const item of notesByAudience) {
      const allowed = canRead(viewer.role, item.audience);

      it(`GET /notes/:id ${viewer.role} x ${item.audience}`, async () => {
        const result = await get(`/api/v1/notes/${item.noteId}`, viewer.id);
        if (allowed) {
          assert.equal(result.status, 200);
          assert.equal((result.body as { audience: string }).audience, item.audience);
        } else {
          assert.equal(result.status, 404);
          assert.deepEqual(result.body, { success: false, error: { message: 'Note not found', statusCode: 404 } });
        }
      });

      it(`GET /references/:id ${viewer.role} x ${item.audience}`, async () => {
        const result = await get(`/api/v1/references/${item.referenceId}`, viewer.id);
        if (allowed) {
          assert.equal(result.status, 200);
          assert.equal((result.body as { title: string }).title, item.audience);
        } else {
          assert.equal(result.status, 404);
          assert.deepEqual(result.body, {
            success: false,
            error: { message: 'Reference not found', statusCode: 404 },
          });
        }
      });

      it(`GET /notes/:id/comments ${viewer.role} x ${item.audience}`, async () => {
        const result = await get(`/api/v1/notes/${item.noteId}/comments`, viewer.id);
        if (allowed) {
          assert.equal(result.status, 200);
          assert.deepEqual(result.body, []);
        } else {
          assert.equal(result.status, 404);
          assert.deepEqual(result.body, { success: false, error: { message: 'Note not found', statusCode: 404 } });
        }
      });
    }

    it(`search ${viewer.role}`, async () => {
      const result = await get(`/api/v1/search?q=${TOKEN}&type=notes`, viewer.id);
      assert.equal(result.status, 200);
      const found = (result.body as { notes: { audience: string }[] }).notes.map((row) => row.audience).sort();
      const expected = notesByAudience
        .filter((item) => canRead(viewer.role, item.audience))
        .map((item) => item.audience)
        .sort();
      assert.deepEqual(found, expected);
    });

    it(`profile notes ${viewer.role}`, async () => {
      const result = await get(`/api/v1/users/${OWNER}/notes`, viewer.id);
      assert.equal(result.status, 200);
      const found = (result.body as { audience: string }[]).map((row) => row.audience).sort();
      const expected = notesByAudience
        .filter((item) => canRead(viewer.role, item.audience))
        .map((item) => item.audience)
        .sort();
      assert.deepEqual(found, expected);
    });

    it(`feed ${viewer.role}`, async () => {
      const result = await get('/api/v1/notes/feed', viewer.id);
      assert.equal(result.status, 200);
      const found = (result.body as { audience: string; userId: number }[]).map((row) => row.audience).sort();
      const expected =
        viewer.role === 'accepted follower'
          ? notesByAudience
              .filter((item) => item.audience === 'PUBLIC' || item.audience === 'FOLLOWERS')
              .map((item) => item.audience)
              .sort()
          : [];
      assert.deepEqual(found, expected);
      assert.equal((result.body as { userId: number }[]).some((row) => row.userId === viewer.id), false);
    });
  }

  it('create rejects legacy visibility fields', async () => {
    const response = await fetch(`${baseUrl}/api/v1/notes`, {
      method: 'POST',
      headers: { ...authHeader(OWNER), 'content-type': 'application/json' },
      body: JSON.stringify({
        content: 'legacy',
        bookName: 'John',
        bookShortName: 'Jn',
        isProfileVisible: true,
        isFeedShared: true,
      }),
    });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.match(body.error.message, /no longer supported/);
  });
});
