import { Reflection } from "@/domain/Reflection/reflection";
import { ReflectionFactory } from "@/domain/Reflection/reflection-factory";

export class ReflectionMapper {
    public static mapReflectionToPersistencePrisma(reflection: Reflection): any {
        return {
            id: reflection.getId(),
            content: reflection.getContent(),
            authorId: reflection.getAuthorId(),
            guideSectionId: reflection.getGuideSectionId(),
            journeyId: reflection.getJourneyId(),
            biblicalReferences: reflection.getBiblicalReferences(),
        };
    }

    public static mapReflectionToDomain(reflection: any): Reflection {
        return ReflectionFactory.create(
            {
                id: reflection.id,
                content: reflection.content,
                authorId: reflection.authorId,
                guideSectionId: reflection.guideSectionId,
                journeyId: reflection.journeyId,
                biblicalReferences: reflection.biblicalReferences,
            }
        );
    }
}