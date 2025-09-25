type SubscriptionType = 'guide' | 'journey';

export class Subscription {
    private constructor(
        private readonly userId: string,
        private readonly targetId: string,
        private readonly type: SubscriptionType,
        private readonly subscribedAt: Date
    ) {}

    static create(userId: string, targetId: string, type: SubscriptionType, subscribedAt: Date = new Date()): Subscription {
        if (!userId) {
            throw new Error('User ID is required for subscription');
        }
        if (!targetId) {
            throw new Error('Target ID is required for subscription');
        }
        if (type !== 'guide' && type !== 'journey') {
            throw new Error('Subscription type must be either "guide" or "journey"');
        }
        return new Subscription(userId, targetId, type, subscribedAt);
    }

    getUserId(): string {
        return this.userId;
    }

    getTargetId(): string {
        return this.targetId;
    }

    getType(): SubscriptionType {
        return this.type;
    }

    getSubscribedAt(): Date {
        return this.subscribedAt;
    }

    equals(other: Subscription): boolean {
        return (
            this.userId === other.userId &&
            this.targetId === other.targetId &&
            this.type === other.type
        );
    }
}
