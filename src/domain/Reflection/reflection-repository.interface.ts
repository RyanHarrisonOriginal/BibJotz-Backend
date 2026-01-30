import { Reflection } from "@/domain/Reflection/reflection";

export interface IReflectionRepository {
    save(reflection: Reflection): Promise<any>;
    findReflection(id: number): Promise<any>;
    findReflections(journeyId?: number, guideSectionId?: number, authorId?: number): Promise<any[]>;
}