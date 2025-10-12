import { Guide } from "@/domain/Guide/guide";
import { GuideSection } from "@/domain/Guide/guide-section";
import { BiblicalReference } from "@/domain/shared/value-objects/BiblicalReference";

export class GuideMapper {

    private static arrayMapper<T>(array: any[], mapper: (item: any) => T): T[] {
        if (!array) {
            return [];
        }
        return array.map((item: any) => mapper(item));
    }

    public static mapBiblicalReferenceModelToDomain(biblicalReference: any): BiblicalReference {
        console.log(biblicalReference);
        return new BiblicalReference(
            biblicalReference.id,
            biblicalReference.book, 
            biblicalReference.chapter, 
            biblicalReference.startVerse, 
            biblicalReference.endVerse
        );
    }

    public static mapGuideSectionModelToDomain(section: any): GuideSection {

        const biblicalReferences = GuideMapper.arrayMapper(
            section.biblicalReferences, 
            GuideMapper.mapBiblicalReferenceModelToDomain
        );

        
        return new GuideSection(
            section.id,
            section.title,
            section.ordinalPosition,
            section.description,
            biblicalReferences
        );
    }


    public static mapGuideModelToDomain(prismaGuide: any): Guide {
        if (!prismaGuide) {
            throw new Error("Guide data is undefined or null");
        }

        const guideSections = GuideMapper.arrayMapper(
            prismaGuide.guideSections, 
            GuideMapper.mapGuideSectionModelToDomain
        );
        const biblicalReferences = GuideMapper.arrayMapper(
            prismaGuide.biblicalReferences, 
            GuideMapper.mapBiblicalReferenceModelToDomain
        );

        return new Guide(
            prismaGuide.id,
            prismaGuide.name,
            prismaGuide.description,
            prismaGuide.isPublic,
            guideSections,
            biblicalReferences,
            prismaGuide.authorId,
            prismaGuide.createdAt,
            prismaGuide.updatedAt
        );
    }


    private static mapBibleReferenceBase(biblicalReference: BiblicalReference): Record<string, any> {
        return {
            id: biblicalReference.getId() ?? 0,
            book: biblicalReference.getBook(),
            chapter: biblicalReference.getChapter(),
            startVerse: biblicalReference.getStartVerse(),
            endVerse: biblicalReference.getEndVerse(),
        };
    }
    

    public static mapGuideBiblicalReferenceToPersistenceModel(
        biblicalReference: BiblicalReference,
        guideId?: number | null
    ): Record<string, any> {
        return {
            ...this.mapBibleReferenceBase(biblicalReference),
            guideId,
        };
    }
    

    public static mapGuideSectionBiblicalReferenceToPersistenceModel(
        biblicalReference: BiblicalReference,
        guideSectionId?: number | null
    ): Record<string, any> {
        return {
            ...this.mapBibleReferenceBase(biblicalReference),
            guideSectionId,
        };
    }


    public static mapGuideSectionToPersistenceModel(section: GuideSection, guideId: number | null): any {
        const biblicalReferences = GuideMapper.arrayMapper(
            section.getBiblicalReferences(), 
            (item) => GuideMapper.mapGuideSectionBiblicalReferenceToPersistenceModel(item, section.getId())
        );

        return {
            id: section.getId(),
            guideId: guideId,
            title: section.getTitle(),
            ordinalPosition: section.getOrdinalPosition(),
            description: section.getDescription(),
            biblicalReferences: biblicalReferences,
        };
    }


    public static mapGuideToPersistencePrisma(guide: Guide): any {
        const biblicalReferences = GuideMapper.arrayMapper(
            guide.getBiblicalReferences(), 
            (item) => GuideMapper.mapGuideBiblicalReferenceToPersistenceModel(item, guide.getId())
        );
        const guideSections = GuideMapper.arrayMapper(
            guide.getGuideSections(), 
            (item) => GuideMapper.mapGuideSectionToPersistenceModel(item, guide.getId())
        );
        return {
            guide: {
            id: guide.getId(),
            name: guide.getName(),
            description: guide.getDescription(),
            isPublic: guide.getIsPublic(),
            authorId: guide.getAuthorId(),
            },
            biblicalReferences: biblicalReferences,
            guideSections: guideSections,
        };
    }
}