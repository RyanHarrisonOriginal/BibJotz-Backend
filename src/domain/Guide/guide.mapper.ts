import { Guide } from "@/domain/Guide/guide";
import { GuideSection } from "@/domain/Guide/guide-section";
import { BiblicalReference } from "@/domain/shared/value-objects/BiblicalReference";

export class GuideMapper {

    private static arrayToDomain<T>(array: any[], mapper: (item: any) => T): T[] {
        if (!array) {
            return [];
        }
        return array.map((item: any) => mapper(item));
    }

    public static mapBiblicalReferenceModelToDomain(bible: any): BiblicalReference {
        return new BiblicalReference(bible.book, bible.chapter, bible.startVerse, bible.endVerse);
    }

    public static mapBiblicalReferenceToPersistenceModel(bible: any, guideId: number | null): any {
        return {
            id: 0,
            guideId: guideId,
            book: bible.getBook(),
            chapter: bible.getChapter(),
            startVerse: bible.getStartVerse(),
            endVerse: bible.getEndVerse(),
        };
    }

    public static mapGuideSectionModelToDomain(section: any): GuideSection {
        const biblicalReferences = this.arrayToDomain(
            section.biblicalReferences, 
            this.mapBiblicalReferenceModelToDomain
        );
        return new GuideSection(
            section.id,
            section.title,
            section.ordinalPosition,
            section.description,
            biblicalReferences
        );
    }

    public static mapGuideSectionToPersistenceModel(section: any, guideId: number | null): any {
        const biblicalReferences = this.arrayToDomain(
            section.biblicalReferences, 
            (item) => this.mapBiblicalReferenceToPersistenceModel(item, guideId)
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



    public static mapGuideModelToDomain(prismaGuide: any): Guide {
        if (!prismaGuide) {
            throw new Error("Guide data is undefined or null");
        }

        const guideSections = this.arrayToDomain(
            prismaGuide.guideSections, 
            this.mapGuideSectionModelToDomain
        );
        const biblicalReferences = this.arrayToDomain(
            prismaGuide.biblicalReferences, 
            this.mapBiblicalReferenceModelToDomain
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

    public static mapToPersistencePrisma(guide: Guide): any {
        const biblicalReferences = this.arrayToDomain(
            guide.getBiblicalRefrences(), 
            (item) => this.mapBiblicalReferenceToPersistenceModel(item, guide.getId())
        );
        const guideSections = this.arrayToDomain(
            guide.getGuideSections(), 
            (item) => this.mapGuideSectionToPersistenceModel(item, guide.getId())
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