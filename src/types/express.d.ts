import { User } from '@/domain/User/user';

declare global {
  namespace Express {
    interface Request {
      clerkUserId?: string;
      authUser?: User;
    }
  }
}

export {};
