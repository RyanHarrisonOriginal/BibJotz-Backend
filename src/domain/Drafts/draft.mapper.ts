import { Draft } from "@/domain/Drafts/draft";
import { DraftFactory } from "@/domain/Drafts/draft-factory";
import { Guide } from "@/domain/Guide/guide";
import { GuideFactory } from "../Guide/guide-factory";

export class DraftMapper {
    public static mapDraftModelToDomain(prismaDraft: any): Draft {
        return DraftFactory.create({
            id: prismaDraft.id ?? null,
            name: prismaDraft.name,
            userId: prismaDraft.userId,
            draftKey: prismaDraft.draftKey,
            draftContent: prismaDraft.draftContent as Record<string, any> || {},
            updatedAt: prismaDraft.updatedAt,
            publishedAt: prismaDraft.publishedAt || null,
        });
    }

    public static mapDraftToPersistenceModel(draft: Draft): any {
        return {
            id: draft.getId(),
            name: draft.getName(),
            userId: draft.getUserId(),
            draftKey: draft.getDraftKey(),
            draftContent: draft.getDraftContent() || {},
            publishedAt: draft.getPublishedAt() || null,
        };
    }

    public static mapDraftsModelToDomain(drafts: any[]): Partial<Draft>[] {
        return drafts.map((draft: any) => this.mapDraftModelToDomain(draft));
    }

    public static mapDraftToGuide(draft: Draft): Guide {
        const draftContent = draft.getDraftContent();
        return GuideFactory.create({
            id: null,
            name: draft.getName(),
            description: draftContent.description || '',
            isPublic: draftContent.isPublic || false,
            biblicalReferences: draftContent.biblicalReferences || [],
            guideSections: draftContent.guideSections || [],
            authorId: draft.getUserId(),
            createdAt: draft.getCreatedAt(),
            updatedAt: draft.getUpdatedAt(),
        });
    }
}

