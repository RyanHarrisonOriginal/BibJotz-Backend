import { Guide } from "@/domain/Guide/guide";
import { GuideSection } from "@/domain/Guide/Sections/guide-section";
import { BiblicalReference } from "@/domain/BiblicalReferences/biblical-reference";
import { GuideFactory } from "@/domain/Guide/guide-factory";
import { IGuide, IGuideListItem, IGuideListPayload } from "./guide.interface";
import { IGuideSection } from "./Sections/guide-section.interface";
import { IBiblicalReference } from "@/domain/BiblicalReferences/biblical-references.interface";

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

    public static mapGuideSectionBiblicalReferencesToPersistenceModel(
        biblicalReferences: BiblicalReference[],
        guideSectionId: number | null): Record<string, any>[] {
        return biblicalReferences.map((item) => this.mapGuideSectionBiblicalReferenceToPersistenceModel(
            item, 
            guideSectionId));
    }

    public static mapGuideSectionToPersistenceModel(
        section: GuideSection,
        guideVersionId: number | null): any {
        const biblicalReferences = GuideMapper.mapGuideSectionBiblicalReferencesToPersistenceModel(
            section.getBiblicalReferences(), 
            section.getId());

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


    public static mapGuideListItemToDomain(guideListItem: any): IGuideListItem {
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

    public static mapGuideListToDomain(guideList: any[]): IGuideListItem[] {
        return guideList.map((item) => this.mapGuideListItemToDomain(item));
    }

    public static mapGuideListPayloadToDomain(guideList: any[], counts: any[]): IGuideListPayload {
        return {
            guides: this.mapGuideListToDomain(guideList),
            counts: {
                myGuides: Number(counts[0].myguides),
                communityGuides: Number(counts[0].communityguides),
            },
        };
    }

    public static mapGuideToInterface(guide: Guide): IGuide {
        return {
            id: guide.getId()?.toString() ?? null,
            name: guide.getName(),
            description: guide.getDescription(),
            isPublic: guide.getIsPublic(),
            biblicalReferences: guide.getBiblicalReferences().map((ref): IBiblicalReference => ({
                id: ref.getId() ?? 0,
                book: ref.getBook(),
                chapter: ref.getChapter(),
                startVerse: ref.getStartVerse(),
                endVerse: ref.getEndVerse(),
            })),
            guideSections: guide.getGuideSections().map((section): IGuideSection => ({
                id: section.getId() ?? 0,
                ordinalPosition: section.getOrdinalPosition(),
                title: section.getTitle(),
                description: section.getDescription(),
                biblicalReferences: section.getBiblicalReferences().map((ref): IBiblicalReference => ({
                    id: ref.getId() ?? 0,
                    book: ref.getBook(),
                    chapter: ref.getChapter(),
                    startVerse: ref.getStartVerse(),
                    endVerse: ref.getEndVerse(),
                })),
            })),
            authorId: guide.getAuthorId(),
        };
    }

    /**
     * Map raw persistence (findGuideById result) to IGuide.
     * Use when you need an IGuide from the DB without building the full Guide domain entity.
     */
    public static mapGuidePersistenceToInterface(persistence: any): IGuide {
        const version = persistence?.versions?.[0];
        if (!version) {
            throw new Error("Guide has no current version");
        }
        const mapRef = (r: any): IBiblicalReference => ({
            id: r?.id ?? 0,
            book: r?.book ?? "",
            chapter: Number(r?.chapter) ?? 0,
            startVerse: Number(r?.startVerse) ?? 0,
            endVerse: Number(r?.endVerse) ?? 0,
        });
        const mapSection = (s: any): IGuideSection => ({
            id: s?.id ?? 0,
            ordinalPosition: Number(s?.ordinalPosition) ?? 0,
            title: s?.title ?? "",
            description: s?.description ?? "",
            biblicalReferences: (s?.biblicalReferences ?? []).map(mapRef),
        });
        return {
            id: persistence?.id != null ? String(persistence.id) : null,
            name: version.name ?? "",
            description: version.description ?? "",
            isPublic: Boolean(persistence?.isPublic),
            biblicalReferences: (version.biblicalReferences ?? []).map(mapRef),
            guideSections: (version.sections ?? []).map(mapSection),
            authorId: Number(persistence?.authorId) ?? 0,
        };
    }
}