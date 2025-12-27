import { Draft } from "@/domain/Drafts/draft";

interface IDraftCreationProps {
    id?: number;
    name: string;
    userId: number;
    draftKey: string;
    draftContent: Record<string, any>;
    updatedAt: Date;
    publishedAt?: Date | null;
}

export class DraftFactory {
    static create(data: IDraftCreationProps): Draft {
        if (!data.userId) {
            throw new Error('UserId is required');
        }
        if (!data.draftContent) {
            throw new Error('DraftContent is required');
        }
        return new Draft(
            data.id ?? null,
            data.name,
            data.userId,
            data.draftKey,
            data.draftContent,
            data.publishedAt || null,
            data.updatedAt
        );
    }
}

