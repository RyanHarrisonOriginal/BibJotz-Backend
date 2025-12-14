import { Draft } from "@/domain/Drafts/draft";
import { DraftFactory } from "@/domain/Drafts/draft-factory";

export class DraftMapper {
    public static mapDraftModelToDomain(prismaDraft: any): Draft {
        return DraftFactory.create({
            id: prismaDraft.id ?? null,
            name: prismaDraft.name,
            userId: prismaDraft.userId,
            draftKey: prismaDraft.draftKey,
            draftContent: prismaDraft.draftContent as Record<string, any> || {},
            updatedAt: prismaDraft.updatedAt,
        });
    }

    public static mapDraftToPersistenceModel(draft: Draft): any {
        return {
            id: draft.getId(),
            name: draft.getName(),
            userId: draft.getUserId(),
            draftKey: draft.getDraftKey(),
            draftContent: draft.getDraftContent() || {},
        };
    }

    public static mapDraftsModelToDomain(drafts: any[]): Partial<Draft>[] {
        return drafts.map((draft: any) => this.mapDraftModelToDomain(draft));
    }
}

