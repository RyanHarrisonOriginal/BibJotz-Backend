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

    public static mapGuideBiblicalReferencesToPersistenceModel(biblicalReferences: BiblicalReference[], guideId: number | null): Record<string, any>[] {
        return biblicalReferences.map((item) => this.mapGuideBiblicalReferenceToPersistenceModel(item, guideId));
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

    public static mapGuideSectionToPersistenceModel(section: GuideSection, guideId: number | null): any {
        const biblicalReferences = GuideMapper.mapGuideSectionBiblicalReferencesToPersistenceModel(section.getBiblicalReferences(), section.getId());

        return {
            id: section.getId(),
            guideId: guideId,
            title: section.getTitle(),
            ordinalPosition: section.getOrdinalPosition(),
            description: section.getDescription(),
            biblicalReferences: biblicalReferences,
        };
    }

    public static mapGuideSectionsToPersistenceModel(guideSections: GuideSection[], guideId: number | null): any[] {
        return guideSections.map((item) => this.mapGuideSectionToPersistenceModel(item, guideId));
    }


    public static mapGuideToPersistenceModel(guide: Guide): any {
        const biblicalReferences = GuideMapper.mapGuideBiblicalReferencesToPersistenceModel(guide.getBiblicalReferences(), guide.getId());
        const guideSections = GuideMapper.mapGuideSectionsToPersistenceModel(guide.getGuideSections(), guide.getId());
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