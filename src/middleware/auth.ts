import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import { UnauthorizedError } from '@/domain/shared/errors/unauthorized-error';
import { IUserRepository } from '@/domain/User/user-repository.interface';
import { UserMapper } from '@/domain/User/user.mapper';
import { User } from '@/domain/User/user';
import { asyncHandler } from '@/middleware/asyncHandler';

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

function requireClerkSecret(): string {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) {
    throw new UnauthorizedError('CLERK_SECRET_KEY is not configured');
  }
  return secret;
}

async function verifyClerkUserId(req: Request): Promise<string> {
  const token = extractBearerToken(req);
  if (!token) throw new UnauthorizedError('Missing Bearer token');

  try {
    const secretKey = requireClerkSecret();
    const authorizedParties = process.env.CLERK_AUTHORIZED_PARTIES
      ?.split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    const payload = await verifyToken(token, {
      secretKey,
      ...(authorizedParties && authorizedParties.length > 0 ? { authorizedParties } : {}),
    });
    const clerkUserId = payload.sub;
    if (!clerkUserId) throw new UnauthorizedError('Invalid token subject');
    return clerkUserId;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError('Invalid or expired token');
  }
}

/** Verify Clerk JWT and attach `req.clerkUserId` (does not require a DB user). */
export const clerkAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  req.clerkUserId = await verifyClerkUserId(req);
  next();
});

/** Verify Clerk JWT, load the linked DB user, and attach `req.authUser`. */
export function requireAuth(userRepository: IUserRepository) {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const clerkUserId = await verifyClerkUserId(req);
    req.clerkUserId = clerkUserId;

    const row = await userRepository.findByClerkUserId(clerkUserId);
    if (!row) {
      throw new UnauthorizedError('User not provisioned. Call POST /users/me first.');
    }

    req.authUser = UserMapper.mapUserToDomain(row);
    next();
  });
}

export function requireAuthUser(req: Request): User {
  if (!req.authUser?.getId()) {
    throw new UnauthorizedError('Authentication required');
  }
  return req.authUser;
}

export function requireAuthUserId(req: Request): number {
  const id = requireAuthUser(req).getId();
  if (!id) throw new UnauthorizedError('Authentication required');
  return id;
}
