import { Journey } from "@/domain/Jouney/jouney";
import { JourneyFactory } from "./journey-factory";
import { GuideMapper } from "@/domain/Guide/guide.mapper";
import {
    IGetJourneyLibraryPayloadDTO,
} from "./journey.dto";

/** Internal type for journey library item (handler return). Not a DTO. */
export interface JourneyLibraryItem {
    id: number;
    title: string;
    guideVersionId: number;
    guideId: number;
    guideTitle: string;
    sections: { id: number; title: string }[] | null;
    reflections: { id: number; entry_key: string; content: string; sectionTitle: string | null; createdAt: string }[] | null;
}

export class JourneyMapper {

    public static mapJourneyToPersistencePrisma(journey: Journey): any {
        return {
            id: journey.getId(),
            name: journey.getName(),
            ownerId: journey.getOwnerId(),
            guideVersionId: journey.getGuideVersionId(),
            description: null,
            createdAt: new Date(),
        };
    }

    public static mapJourneyModelToDomain(prismaJourney: any): Journey {
        if (!prismaJourney) {
            throw new Error("Journey data is required");
        }

        const guideVersion = prismaJourney.guideVersion;
        if (!guideVersion?.guide) {
            throw new Error("Journey must have guideVersion relation loaded (include guideVersion with guide, sections, biblicalReferences)");
        }

        const guidePersistence = {
            id: guideVersion.guide.id,
            isPublic: guideVersion.guide.isPublic,
            authorId: guideVersion.guide.authorId,
            versions: [
                {
                    name: guideVersion.name,
                    description: guideVersion.description,
                    sections: guideVersion.sections ?? [],
                    biblicalReferences: guideVersion.biblicalReferences ?? [],
                },
            ],
        };
        const sourceGuide = GuideMapper.mapGuidePersistenceToInterface(guidePersistence);

        const createdAt = prismaJourney.createdAt ? new Date(prismaJourney.createdAt) : new Date();
        const sections: any[] = [];

        return JourneyFactory.create({
            id: prismaJourney.id,
            guideVersionId: prismaJourney.guideVersionId,
            name: prismaJourney.name ?? "",
            ownerId: prismaJourney.ownerId ?? 0,
            sourceGuide,
            sections,
            createdAt,
            updatedAt: createdAt,
        });
    }

    /**
     * Map raw journey library query rows (persistence) to internal JourneyLibraryItem[].
     * Used by the query handler after repository returns raw rows.
     */
    public static mapJourneyLibraryRowsToItems(rows: any[]): JourneyLibraryItem[] {
        return (rows ?? []).map((row) => this.mapJourneyLibraryRowToItem(row));
    }

    private static mapJourneyLibraryRowToItem(row: any): JourneyLibraryItem {
        const sections = Array.isArray(row.sections) ? row.sections : (row.sections ? [row.sections] : null);
        const reflections = Array.isArray(row.reflections) ? row.reflections : (row.reflections ? [row.reflections] : null);
        return {
            id: row.id,
            title: row.title ?? '',
            guideVersionId: row.guide_version_id ?? 0,
            guideId: row.guide_id ?? 0,
            guideTitle: row.guide_title ?? '',
            sections: sections?.filter((s: any) => s?.id != null).map((s: any) => ({ id: s.id, title: s.title ?? '' })) ?? null,
            reflections: reflections?.filter((r: any) => r?.id != null).map((r: any) => ({
                id: r.id,
                entry_key: r.entry_key ?? '',
                content: r.content ?? '',
                sectionTitle: r.sectionTitle ?? null,
                createdAt: r.createdAt ?? new Date().toISOString(),
            })) ?? null,
        };
    }

    /**
     * Map internal journey library items to response DTO for HTTP.
     * Used only in the controller before res.json(responseDto).
     */
    public static mapJourneyLibraryToResponseDTO(items: JourneyLibraryItem[]): IGetJourneyLibraryPayloadDTO {
        return {
            journeys: items.map((item) => ({
                id: String(item.id),
                title: item.title,
                guideTitle: item.guideTitle,
                sections: (item.sections ?? []).map((s) => ({
                    id: String(s.id),
                    title: s.title,
                })),
                reflections: (item.reflections ?? []).map((r) => ({
                    id: String(r.id),
                    entry_key: r.entry_key,
                    content: r.content,
                    sectionTitle: r.sectionTitle ?? '',
                    createdAt: r.createdAt,
                })),
            })),
        };
    }
}