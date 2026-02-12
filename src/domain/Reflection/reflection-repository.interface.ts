import { Reflection } from "@/domain/Reflection/reflection";

export interface IReflectionRepository {
    save(reflection: Reflection): Promise<any>;
    findReflection(id: number): Promise<any>;
    findReflections(journeyId?: number, guideSectionId?: number, authorId?: number): Promise<any[]>;
    /** Idempotent create-or-update by entry_key. */
    upsertReflection(entryKey: string, journeyId: number, guideSectionId: number, authorId: number, content: string): Promise<any>;
}