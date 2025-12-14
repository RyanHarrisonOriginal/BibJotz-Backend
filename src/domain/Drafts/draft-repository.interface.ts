import { Draft } from "@/domain/Drafts/draft";

export interface IDraftRepository {
    save(draft: Draft): Promise<Draft>;
    findDraftByDraftKey(draftKey: string): Promise<Draft>;
    findAllDraftsByDraftKey(draftKey: string): Promise<Draft[]>;
    findAllDraftsByUserId(userId: number): Promise<Partial<Draft>[]>;
    delete(draftKey: string): Promise<void>;
}

