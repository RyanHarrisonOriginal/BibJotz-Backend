process.env.NODE_ENV = 'test';

import assert from 'node:assert/strict';
import { Server } from 'http';
import { after, before, describe, it } from 'node:test';
import express, { NextFunction, Request, Response } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { GetNoteQueryHandler } from '@/domain/Note/queries/get-note/get-note-query.handler';
import { GetReferenceQueryHandler } from '@/domain/Reference/queries/get-reference/get-reference-query.handler';
import { ListCommentsQueryHandler } from '@/domain/Comment/queries/list-comments/list-comments-query.handler';
import { INoteRepository } from '@/domain/Note/note-repository.interface';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { IFollowRepository } from '@/domain/Follow/follow-repository.interface';
import { ICommentRepository } from '@/domain/Comment/comment-repository.interface';
import { noteRoutes } from '@/infrastructure/http/routes/note.routes';
import { referenceRoutes } from '@/infrastructure/http/routes/reference.routes';
import { errorHandler } from '@/middleware/errorHandler';
import { UnauthorizedError } from '@/domain/shared/errors/unauthorized-error';
import { User } from '@/domain/User/user';

const NOW = new Date('2024-06-01T00:00:00.000Z');
const MISSING_ID = 2147483646;
const OWNER_ID = 10;
const VIEWER_ID = 20;
const REFERENCE_KEYS = ['author', 'createdAt', 'id', 'title', 'typeId', 'typeName', 'updatedAt', 'userId'];

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
  audience: 'PRIVATE' | 'FOLLOWERS' | 'PUBLIC';
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

type StoredReference = {
  id: number;
  userId: number;
  typeId: number;
  title: string;
  normalizedTitle: string;
  author: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: { name: string };
};

class MemoryNotes {
  rows = new Map<number, StoredNote>();
  referenceLookups = 0;

  async findById(id: number): Promise<StoredNote | null> {
    return this.rows.get(id) ?? null;
  }

  async findManyByReferenceId(referenceId: number): Promise<StoredNote[]> {
    this.referenceLookups += 1;
    return [...this.rows.values()].filter((note) =>
      note.references.some((tag) => tag.reference.id === referenceId),
    );
  }
}

class MemoryReferences {
  rows = new Map<number, StoredReference>();

  async findById(id: number): Promise<StoredReference | null> {
    return this.rows.get(id) ?? null;
  }
}

class MemoryFollows {
  pairs = new Set<string>();
  lookups = 0;

  async findByPair(followerId: number, followingId: number): Promise<{ id: number; status: 'ACCEPTED' } | null> {
    this.lookups += 1;
    return this.pairs.has(`${followerId}:${followingId}`) ? { id: 1, status: 'ACCEPTED' } : null;
  }

  follow(followerId: number, followingId: number): void {
    this.pairs.add(`${followerId}:${followingId}`);
  }
}

function note(input: {
  id: number;
  userId?: number;
  content: string;
  isProfileVisible?: boolean;
  isFeedShared?: boolean;
  audience?: 'PRIVATE' | 'FOLLOWERS' | 'PUBLIC';
  referenceId?: number;
}): StoredNote {
  return {
    id: input.id,
    userId: input.userId ?? OWNER_ID,
    content: input.content,
    bookName: 'John',
    bookShortName: 'Jn',
    chapter: 3,
    startVerse: 16,
    endVerse: 16,
    verseSpans: null,
    audience:
      input.audience ??
      (input.isProfileVisible ? 'PUBLIC' : input.isFeedShared ? 'FOLLOWERS' : 'PRIVATE'),
    createdAt: NOW,
    updatedAt: NOW,
    references: input.referenceId == null ? [] : [
      {
        reference: {
          id: input.referenceId,
          title: 'Tagged',
          author: null,
          typeId: 4,
          type: { id: 4, name: 'Commentary' },
        },
      },
    ],
  };
}

function reference(input: { id: number; userId?: number; title: string }): StoredReference {
  return {
    id: input.id,
    userId: input.userId ?? OWNER_ID,
    typeId: 4,
    title: input.title,
    normalizedTitle: input.title.trim().toLowerCase(),
    author: 'Ada',
    createdAt: NOW,
    updatedAt: NOW,
    type: { name: 'Commentary' },
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

type Harness = {
  baseUrl: string;
  notes: MemoryNotes;
  follows: MemoryFollows;
  close: () => Promise<void>;
};

type HttpResult = { status: number; body: Record<string, unknown> };

async function getJson(url: string, userId: number): Promise<HttpResult> {
  const response = await fetch(url, { headers: authHeader(userId) });
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

function notFound(message: string): Record<string, unknown> {
  return { success: false, error: { message, statusCode: 404 } };
}

describe('single-record read authorization', { concurrency: false }, () => {
  let harness: Harness;
  let references: MemoryReferences;
  let errorLog: typeof console.error = console.error;

  before(async () => {
    errorLog = console.error;
    console.error = () => undefined;
    const notes = new MemoryNotes();
    const follows = new MemoryFollows();
    references = new MemoryReferences();
    const comments = { async findByNoteId() { return []; } };
    const queryBus = new QueryBus();
    queryBus.registerHandler(
      'GetNoteQuery',
      new GetNoteQueryHandler(notes as unknown as INoteRepository, follows as unknown as IFollowRepository),
    );
    queryBus.registerHandler(
      'GetReferenceQuery',
      new GetReferenceQueryHandler(
        references as unknown as IReferenceRepository,
        notes as unknown as INoteRepository,
        follows as unknown as IFollowRepository,
      ),
    );
    queryBus.registerHandler(
      'ListCommentsQuery',
      new ListCommentsQueryHandler(
        comments as unknown as ICommentRepository,
        notes as unknown as INoteRepository,
        follows as unknown as IFollowRepository,
      ),
    );

    const app = express();
    app.use(express.json());
    app.use(testAuth);
    app.use('/api/v1/notes', noteRoutes(new CommandBus(), queryBus));
    app.use('/api/v1/references', referenceRoutes(new CommandBus(), queryBus));
    app.use(errorHandler);

    const server = await new Promise<Server>((resolve) => {
      const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
    });
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    harness = {
      baseUrl: `http://127.0.0.1:${port}`,
      notes,
      follows,
      close: () =>
        new Promise((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        }),
    };
  });

  after(async () => {
    console.error = errorLog;
    await harness.close();
  });

  function reset(): void {
    harness.notes.rows.clear();
    harness.notes.referenceLookups = 0;
    harness.follows.pairs.clear();
    harness.follows.lookups = 0;
    references.rows.clear();
  }

  describe('GET /notes/:id', () => {
    it('owner of a private note receives 200', async () => {
      reset();
      harness.notes.rows.set(1, note({ id: 1, content: 'owner private note' }));

      const result = await getJson(`${harness.baseUrl}/api/v1/notes/1`, OWNER_ID);

      assert.equal(result.status, 200);
      assert.equal(result.body.content, 'owner private note');
      assert.equal(result.body.audience, 'PRIVATE');
      assert.equal(harness.follows.lookups, 0);
    });

    it('non-owner of a private note receives 404 identical to a missing note', async () => {
      reset();
      harness.notes.rows.set(1, note({ id: 1, content: 'hidden private note' }));

      const hidden = await getJson(`${harness.baseUrl}/api/v1/notes/1`, VIEWER_ID);
      const missing = await getJson(`${harness.baseUrl}/api/v1/notes/${MISSING_ID}`, VIEWER_ID);

      assert.equal(hidden.status, 404);
      assert.equal(missing.status, 404);
      assert.deepEqual(hidden.body, notFound('Note not found'));
      assert.deepEqual(hidden.body, missing.body);
      assert.equal(JSON.stringify(hidden.body).includes('hidden private note'), false);
      assert.equal(harness.follows.lookups, 0);
    });

    it('non-owner non-follower can read a profile-visible note', async () => {
      reset();
      harness.notes.rows.set(2, note({ id: 2, content: 'on profile', isProfileVisible: true }));

      const result = await getJson(`${harness.baseUrl}/api/v1/notes/2`, VIEWER_ID);

      assert.equal(result.status, 200);
      assert.equal(result.body.content, 'on profile');
      assert.equal(harness.follows.lookups, 0);
    });

    it('non-owner non-follower cannot read a feed-shared note', async () => {
      reset();
      harness.notes.rows.set(3, note({ id: 3, content: 'feed only', isFeedShared: true }));

      const hidden = await getJson(`${harness.baseUrl}/api/v1/notes/3`, VIEWER_ID);
      const missing = await getJson(`${harness.baseUrl}/api/v1/notes/${MISSING_ID}`, VIEWER_ID);

      assert.equal(hidden.status, 404);
      assert.deepEqual(hidden.body, missing.body);
      assert.equal(harness.follows.lookups, 1);
    });

    it('follower can read a feed-shared note', async () => {
      reset();
      harness.notes.rows.set(4, note({ id: 4, content: 'for followers', isFeedShared: true }));
      harness.follows.follow(VIEWER_ID, OWNER_ID);

      const result = await getJson(`${harness.baseUrl}/api/v1/notes/4`, VIEWER_ID);

      assert.equal(result.status, 200);
      assert.equal(result.body.content, 'for followers');
      assert.equal(harness.follows.lookups, 1);
    });

    it('nonexistent id returns 404 with the same body as an unauthorized read', async () => {
      reset();
      harness.notes.rows.set(5, note({ id: 5, content: 'still private' }));

      const hidden = await getJson(`${harness.baseUrl}/api/v1/notes/5`, VIEWER_ID);
      const missing = await getJson(`${harness.baseUrl}/api/v1/notes/${MISSING_ID}`, VIEWER_ID);

      assert.equal(missing.status, 404);
      assert.deepEqual(missing.body, hidden.body);
    });
  });

  describe('GET /references/:id', () => {
    it('owner receives 200 without a linked-note lookup', async () => {
      reset();
      references.rows.set(80, reference({ id: 80, title: 'Owner Commentary' }));

      const result = await getJson(`${harness.baseUrl}/api/v1/references/80`, OWNER_ID);

      assert.equal(result.status, 200);
      assert.equal(result.body.title, 'Owner Commentary');
      assert.equal(result.body.userId, OWNER_ID);
      assert.deepEqual(Object.keys(result.body).sort(), REFERENCE_KEYS);
      assert.equal(harness.notes.referenceLookups, 0);
      assert.equal(harness.follows.lookups, 0);
    });

    it('non-owner linked only to private notes receives 404', async () => {
      reset();
      references.rows.set(81, reference({ id: 81, title: 'Private Link' }));
      harness.notes.rows.set(501, note({ id: 501, content: 'private-note-body', referenceId: 81 }));

      const hidden = await getJson(`${harness.baseUrl}/api/v1/references/81`, VIEWER_ID);
      const missing = await getJson(`${harness.baseUrl}/api/v1/references/${MISSING_ID}`, VIEWER_ID);

      assert.equal(hidden.status, 404);
      assert.deepEqual(hidden.body, notFound('Reference not found'));
      assert.deepEqual(hidden.body, missing.body);
      assert.equal(JSON.stringify(hidden.body).includes('private-note-body'), false);
    });

    it('non-owner linked to one profile-visible note and one private note receives 200 without private note data', async () => {
      reset();
      references.rows.set(82, reference({ id: 82, title: 'Mixed Commentary' }));
      harness.notes.rows.set(
        501,
        note({ id: 501, content: 'secret-private-note-body', referenceId: 82 }),
      );
      harness.notes.rows.set(
        502,
        note({ id: 502, content: 'profile-visible-note-body', isProfileVisible: true, referenceId: 82 }),
      );

      const result = await getJson(`${harness.baseUrl}/api/v1/references/82`, VIEWER_ID);
      const serialized = JSON.stringify(result.body);

      assert.equal(result.status, 200);
      assert.equal(result.body.title, 'Mixed Commentary');
      assert.deepEqual(Object.keys(result.body).sort(), REFERENCE_KEYS);
      assert.equal(serialized.includes('secret-private-note-body'), false);
      assert.equal(serialized.includes('profile-visible-note-body'), false);
      assert.equal(serialized.includes('501'), false);
      assert.equal(serialized.includes('502'), false);
      assert.equal('notes' in result.body, false);
      assert.equal('noteIds' in result.body, false);
      assert.equal('noteCount' in result.body, false);
      assert.equal(harness.follows.lookups, 0);
    });

    it('non-follower linked only to a feed-shared note receives 404', async () => {
      reset();
      references.rows.set(83, reference({ id: 83, title: 'Feed Commentary' }));
      harness.notes.rows.set(
        503,
        note({ id: 503, content: 'feed-note-body', isFeedShared: true, referenceId: 83 }),
      );

      const hidden = await getJson(`${harness.baseUrl}/api/v1/references/83`, VIEWER_ID);
      const missing = await getJson(`${harness.baseUrl}/api/v1/references/${MISSING_ID}`, VIEWER_ID);

      assert.equal(hidden.status, 404);
      assert.deepEqual(hidden.body, missing.body);
      assert.equal(harness.follows.lookups, 1);
    });

    it('follower linked only to a feed-shared note receives 200', async () => {
      reset();
      references.rows.set(84, reference({ id: 84, title: 'Follower Commentary' }));
      harness.notes.rows.set(
        504,
        note({ id: 504, content: 'follower-note-body', isFeedShared: true, referenceId: 84 }),
      );
      harness.follows.follow(VIEWER_ID, OWNER_ID);

      const result = await getJson(`${harness.baseUrl}/api/v1/references/84`, VIEWER_ID);

      assert.equal(result.status, 200);
      assert.equal(result.body.title, 'Follower Commentary');
      assert.deepEqual(Object.keys(result.body).sort(), REFERENCE_KEYS);
      assert.equal(JSON.stringify(result.body).includes('follower-note-body'), false);
      assert.equal(harness.follows.lookups, 1);
    });

    it('non-owner receives 404 after a shared note is made private', async () => {
      reset();
      references.rows.set(85, reference({ id: 85, title: 'Once Shared' }));
      const shared = note({
        id: 505,
        content: 'was-shared-note-body',
        isProfileVisible: true,
        referenceId: 85,
      });
      harness.notes.rows.set(505, shared);

      const visible = await getJson(`${harness.baseUrl}/api/v1/references/85`, VIEWER_ID);
      assert.equal(visible.status, 200);
      assert.equal(harness.follows.lookups, 0);

      shared.audience = 'PRIVATE';

      const hidden = await getJson(`${harness.baseUrl}/api/v1/references/85`, VIEWER_ID);
      const missing = await getJson(`${harness.baseUrl}/api/v1/references/${MISSING_ID}`, VIEWER_ID);

      assert.equal(hidden.status, 404);
      assert.deepEqual(hidden.body, notFound('Reference not found'));
      assert.deepEqual(hidden.body, missing.body);
    });

    it('nonexistent id returns 404 with the same body as an unauthorized read', async () => {
      reset();
      references.rows.set(86, reference({ id: 86, title: 'Unshared' }));
      harness.notes.rows.set(506, note({ id: 506, content: 'still-private', referenceId: 86 }));

      const hidden = await getJson(`${harness.baseUrl}/api/v1/references/86`, VIEWER_ID);
      const missing = await getJson(`${harness.baseUrl}/api/v1/references/${MISSING_ID}`, VIEWER_ID);

      assert.equal(missing.status, 404);
      assert.deepEqual(missing.body, hidden.body);
    });

    it('non-owner with no linked notes receives 404', async () => {
      reset();
      references.rows.set(87, reference({ id: 87, title: 'Orphan Reference' }));

      const hidden = await getJson(`${harness.baseUrl}/api/v1/references/87`, VIEWER_ID);
      const missing = await getJson(`${harness.baseUrl}/api/v1/references/${MISSING_ID}`, VIEWER_ID);

      assert.equal(hidden.status, 404);
      assert.deepEqual(hidden.body, missing.body);
    });
  });

  describe('GET /notes/:id/comments', () => {
    it('hides private and feed-only notes with the same 404 as a missing note', async () => {
      reset();
      harness.notes.rows.set(11, note({ id: 11, content: 'private' }));
      harness.notes.rows.set(12, note({ id: 12, content: 'profile', isProfileVisible: true }));
      harness.notes.rows.set(13, note({ id: 13, content: 'feed', isFeedShared: true }));

      const ownerPrivate = await getJson(`${harness.baseUrl}/api/v1/notes/11/comments`, OWNER_ID);
      const strangerPrivate = await getJson(`${harness.baseUrl}/api/v1/notes/11/comments`, VIEWER_ID);
      const strangerProfile = await getJson(`${harness.baseUrl}/api/v1/notes/12/comments`, VIEWER_ID);
      const strangerFeed = await getJson(`${harness.baseUrl}/api/v1/notes/13/comments`, VIEWER_ID);
      const missing = await getJson(`${harness.baseUrl}/api/v1/notes/${MISSING_ID}/comments`, VIEWER_ID);

      harness.follows.follow(VIEWER_ID, OWNER_ID);
      const followerFeed = await getJson(`${harness.baseUrl}/api/v1/notes/13/comments`, VIEWER_ID);

      assert.equal(ownerPrivate.status, 200);
      assert.deepEqual(ownerPrivate.body, []);
      assert.equal(strangerProfile.status, 200);
      assert.deepEqual(strangerProfile.body, []);
      assert.equal(followerFeed.status, 200);
      assert.deepEqual(followerFeed.body, []);
      assert.equal(missing.status, 404);
      assert.deepEqual(missing.body, notFound('Note not found'));
      assert.equal(strangerPrivate.status, 404);
      assert.deepEqual(strangerPrivate.body, missing.body);
      assert.equal(strangerFeed.status, 404);
      assert.deepEqual(strangerFeed.body, missing.body);
    });
  });
});
