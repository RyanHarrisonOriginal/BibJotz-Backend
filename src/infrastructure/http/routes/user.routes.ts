import { Router, RequestHandler } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { UserController } from '@/infrastructure/http/controllers/user.controller';
import { asyncHandler } from '@/middleware/asyncHandler';

export const userRoutes = (
  commandBus: CommandBus,
  queryBus: QueryBus,
  clerkAuth: RequestHandler,
  requireAuth: RequestHandler,
) => {
  const router = Router();
  const controller = new UserController(commandBus, queryBus);

  // Provision / resolve current user from Clerk token (no DB user required yet)
  router.post('/me', clerkAuth, asyncHandler(controller.ensureMe));
  router.get('/me', requireAuth, asyncHandler(controller.getMe));
  router.get('/me/follow-requests', requireAuth, asyncHandler(controller.listFollowRequests));
  router.post(
    '/me/follow-requests/:followerId/accept',
    requireAuth,
    asyncHandler(controller.acceptFollowRequest),
  );
  router.post(
    '/me/follow-requests/:followerId/decline',
    requireAuth,
    asyncHandler(controller.declineFollowRequest),
  );
  router.delete('/me/followers/:followerId', requireAuth, asyncHandler(controller.removeFollower));
  router.patch('/me/follow-settings', requireAuth, asyncHandler(controller.updateFollowSettings));

  // Legacy create alias — still requires Clerk token; clerkUserId comes from JWT
  router.post('/', clerkAuth, asyncHandler(controller.createUser));

  router.get('/:id', requireAuth, asyncHandler(controller.getUser));
  router.patch('/:id', requireAuth, asyncHandler(controller.updateUser));
  router.get('/:id/notes', requireAuth, asyncHandler(controller.listProfileNotes));
  router.post('/:id/follow', requireAuth, asyncHandler(controller.followUser));
  router.delete('/:id/follow', requireAuth, asyncHandler(controller.unfollowUser));
  router.get('/:id/followers', requireAuth, asyncHandler(controller.listFollowers));
  router.get('/:id/following', requireAuth, asyncHandler(controller.listFollowing));

  return router;
};
