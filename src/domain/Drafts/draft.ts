import { BaseEntity } from "@/domain/BaseEntity";

export class Draft extends BaseEntity {
    constructor(
        id: number | null,
        private name: string,
        private userId: number,
        private draftKey: string,
        private draftContent: Record<string, any>,  
        private publishedAt: Date | null,
        updatedAt: Date = new Date()
    ) {
        // Use updatedAt as createdAt since the schema doesn't have created_at
        super(id ?? 0, updatedAt, updatedAt);
    }

    getName(): string {
        return this.name;
    }

    getUserId(): number {
        return this.userId;
    }

    getDraftContent(): Record<string, any> {
        return this.draftContent;
    }

    getDraftKey(): string {
        return this.draftKey;
    }

    getPublishedAt(): Date | null {
        return this.publishedAt;
    }

    updateDraftContent(draftContent: Record<string, any>) {
        this.draftContent = draftContent;
        this.touch();
    }

    publish() {
        this.publishedAt = new Date();
        this.touch();
    }
}

