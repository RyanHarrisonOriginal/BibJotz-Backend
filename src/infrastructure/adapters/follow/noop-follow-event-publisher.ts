import { FollowEvent, IFollowEventPublisher } from '@/domain/Follow/ports/follow-event-publisher.port';

/** Adapter until a real event bus exists. Domain code depends only on the port. */
export class NoopFollowEventPublisher implements IFollowEventPublisher {
  async publish(_event: FollowEvent): Promise<void> {
    return undefined;
  }
}
