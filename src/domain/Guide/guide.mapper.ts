import { Guide } from "@/domain/Guide/guide";
import { GuideSection } from "@/domain/Guide/Sections/guide-section";
import { BiblicalReference } from "@/domain/BiblicalReferences/biblical-reference";
import { GuideFactory } from "@/domain/Guide/guide-factory";
import { GuideListItem, GuideListPayload } from "./guide.interface";

export class GuideMapper {


    public static mapGuideModelToDomain(prismaGuide: any): Guide {
        return GuideFactory.create(prismaGuide);
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

    public static mapGuideSectionBiblicalReferencesToPersistenceModel(biblicalReferences: BiblicalReference[], guideSectionId: number | null): Record<string, any>[] {
        return biblicalReferences.map((item) => this.mapGuideSectionBiblicalReferenceToPersistenceModel(item, guideSectionId));
    }

    public static mapGuideSectionToPersistenceModel(section: GuideSection, guideVersionId: number | null): any {
        const biblicalReferences = GuideMapper.mapGuideSectionBiblicalReferencesToPersistenceModel(section.getBiblicalReferences(), section.getId());

        return {
            id: section.getId(),
            guideVersionId: guideVersionId,
            title: section.getTitle(),
            ordinalPosition: section.getOrdinalPosition(),
            description: section.getDescription(),
            biblicalReferences: biblicalReferences,
        };
    }

    public static mapGuidetoRootPeristenceModel(guide: Guide): any {
        return {
            id: guide.getId(),
            isPublic: guide.getIsPublic(),
            authorId: guide.getAuthorId(),
        };
    }

    public static mapGuideToGuideVersionPersistenceModel(guide: any, guideId: number | null): any {
        return {
            guideId: guideId,
            isCurrent: true,    
            name: guide.name,
            description: guide.description,
        };
    }

    public static mapGuideBiblicalReferencesToPersistenceModel(
        biblicalReferences: BiblicalReference[],
        guideVersionId: number | null
    ): Record<string, any>[] {
        return biblicalReferences.map(
            (item) => this.mapGuideBiblicalReferenceToPersistenceModel(item, guideVersionId));
    }

    public static mapGuideSectionsToPersistenceModel(
        guideSections: GuideSection[],
        guideVersionId: number | null
    ): any[] {
        return guideSections.map(
            (item) => this.mapGuideSectionToPersistenceModel(item, guideVersionId));
    }


    public static mapGuideListItemToDomain(guideListItem: any): GuideListItem {
        return {
            id: Number(guideListItem.id),
            name: guideListItem.name,
            description: guideListItem.description,
            isPublic: guideListItem.ispublic,
            authorName: guideListItem.authorname,
            numberOfSections: Number(guideListItem.numberofsections),
            numberOfJourneys: Number(guideListItem.numberofjourneys),
            numberOfReflections: Number(guideListItem.numberofreflections),
        };
    }

    public static mapGuideListToDomain(guideList: any[]): GuideListItem[] {
        return guideList.map((item) => this.mapGuideListItemToDomain(item));
    }

    public static mapGuideListPayloadToDomain(guideList: any[], counts: any[]): GuideListPayload {
        return {
            guides: this.mapGuideListToDomain(guideList),
            counts: {
                myGuides: Number(counts[0].myguides),
                communityGuides: Number(counts[0].communityguides),
            },
        };
    }
}