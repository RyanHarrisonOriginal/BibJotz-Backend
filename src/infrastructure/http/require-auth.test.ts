process.env.NODE_ENV = 'test';

import assert from 'node:assert/strict';
import { Server } from 'http';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { routes } from '@/infrastructure/http/routes';
import { errorHandler } from '@/middleware/errorHandler';

const userRepository = {
  async findByClerkUserId(): Promise<never> {
    throw new Error('requireAuth should reject before loading a user');
  },
} as unknown as IUserRepository;

describe('requireAuth', { concurrency: false }, () => {
  let baseUrl = '';
  let server: Server;
  let errorLog: typeof console.error = console.error;
  let previousClerkSecret: string | undefined;

  before(async () => {
    errorLog = console.error;
    console.error = () => undefined;
    previousClerkSecret = process.env.CLERK_SECRET_KEY;
    if (!previousClerkSecret) {
      process.env.CLERK_SECRET_KEY = 'sk_test_not_a_real_clerk_secret';
    }

    const app = express();
    app.use(express.json());
    app.use('/api', routes(new CommandBus(), new QueryBus(), userRepository));
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
    if (previousClerkSecret == null) delete process.env.CLERK_SECRET_KEY;
    else process.env.CLERK_SECRET_KEY = previousClerkSecret;
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it('returns 401 when the Authorization header is missing', async () => {
    const response = await fetch(`${baseUrl}/api/v1/users/1`);
    const body = (await response.json()) as { success: boolean; error: { statusCode: number; message: string } };

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.error.statusCode, 401);
    assert.equal(body.error.message, 'Missing Bearer token');
  });

  it('returns 401 when the bearer token is invalid', async () => {
    const response = await fetch(`${baseUrl}/api/v1/users/1`, {
      headers: { Authorization: 'Bearer this-token-is-not-a-clerk-jwt' },
    });
    const body = (await response.json()) as { success: boolean; error: { statusCode: number; message: string } };

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.error.statusCode, 401);
    assert.equal(body.error.message, 'Invalid or expired token');
  });
});
