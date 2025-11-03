import { Reflection } from "@/domain/Reflection/reflection";

export interface IReflectionRepository {
    save(reflection: Reflection): Promise<Reflection>;
    findReflection(id: number): Promise<Reflection>;
    findReflections(journeyId?: number, guideSectionId?: number, authorId?: number): Promise<Reflection[]>;
}