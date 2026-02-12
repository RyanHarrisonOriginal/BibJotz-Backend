import { Reflection } from "@/domain/Reflection/reflection";
import { ReflectionFactory } from "@/domain/Reflection/reflection-factory";
import { IReflectionResponseDTO } from "@/domain/Reflection/reflection.dto";
import { BiblicalReferenceMapper } from "@/domain/BiblicalReferences/biblical-reference.mapper";

export class ReflectionMapper {
    public static mapReflectionToPersistencePrisma(reflection: Reflection): any {
        return {
            id: reflection.getId(),
            entryKey: reflection.getEntryKey(),
            content: reflection.getContent(),
            authorId: reflection.getAuthorId(),
            guideSectionId: reflection.getGuideSectionId(),
            journeyId: reflection.getJourneyId(),
            biblicalReferences: reflection.getBiblicalReferences(),
        };
    }

    public static mapReflectionToDomain(reflection: any): Reflection {
        return ReflectionFactory.create({
            id: reflection.id,
            entryKey: reflection.entryKey ?? reflection.entry_key ?? '',
            content: reflection.content,
            authorId: reflection.authorId,
            guideSectionId: reflection.guideSectionId,
            journeyId: reflection.journeyId,
            biblicalReferences: BiblicalReferenceMapper.mapBiblicalReferencesToDomain(reflection.biblicalReferences ?? []),
        });
    }

    public static mapReflectionToResponseDTO(reflection: Reflection): IReflectionResponseDTO {
        return {
            id: reflection.getId() ?? 0,
            entry_key: reflection.getEntryKey(),
            content: reflection.getContent(),
            authorId: reflection.getAuthorId(),
            journeyId: reflection.getJourneyId(),
            guideSectionId: reflection.getGuideSectionId(),
            biblicalReferences: BiblicalReferenceMapper.mapBiblicalReferencesToDTO(reflection.getBiblicalReferences() ?? []),
            createdAt: reflection.getCreatedAt().toISOString(),
            updatedAt: reflection.getUpdatedAt().toISOString(),
        };
    }
}