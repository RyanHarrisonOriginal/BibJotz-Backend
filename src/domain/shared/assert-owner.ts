import { ForbiddenError } from '@/domain/shared/errors/forbidden-error';
import { ValidationError } from '@/domain/shared/errors/validation-error';

export function parseActorUserId(actorUserId: number | undefined): number {
  const id = Number(actorUserId);
  if (!id || Number.isNaN(id) || id < 1) {
    throw new ValidationError('actorUserId is required');
  }
  return id;
}

export function assertResourceOwner(resourceUserId: number, actorUserId: number): void {
  if (resourceUserId !== actorUserId) {
    throw new ForbiddenError('You do not own this resource');
  }
}
