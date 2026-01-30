import { Draft } from "@/domain/Drafts/draft";

export interface IDraftRepository {
    save(draft: Draft): Promise<any>;
    findDraftByDraftKey(draftKey: string): Promise<any>;
    findAllDraftsByDraftKey(draftKey: string): Promise<any[]>;
    findAllDraftsByUserId(userId: number): Promise<any[]>;
    delete(draftKey: string): Promise<void>;
}

