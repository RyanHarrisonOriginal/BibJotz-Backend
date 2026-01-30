import { Journey } from "@/domain/Jouney/jouney";
import { JourneyFactory } from "./journey-factory";
import { GuideMapper } from "@/domain/Guide/guide.mapper";

export class JourneyMapper {

    public static mapJourneyToPersistencePrisma(journey: Journey): any {
        // Note: Journey domain model doesn't have reflections directly
        // Reflections are managed separately through ReflectionRepository
        // The sourceGuide contains the guideVersionId we need
        const sourceGuide = journey.getSourceGuide();
        // We need to extract guideVersionId from the sourceGuide
        // This is a limitation - we may need to store guideVersionId separately in Journey
        return {
            id: journey.getId(),
            name: journey.getName(),
            ownerId: journey.getOwnerId(),
            guideVersionId: sourceGuide.id ? parseInt(sourceGuide.id) : null, // TODO: Fix this - guideVersionId should be stored in Journey
            reflections: [], // Reflections are managed separately
        };
    }

    public static mapJourneyModelToDomain(prismaJourney: any): Journey {
        if (!prismaJourney) {
            throw new Error('Journey data is required');
        }

        // Map the guide from the guideVersion relation
        // The guideVersion has a guide relation, so we need to construct the full guide structure
        const guideVersion = prismaJourney.guideVersion;
        if (!guideVersion || !guideVersion.guide) {
            throw new Error('Journey must have an associated guide version and guide');
        }

        // Construct guide data from guideVersion structure to match GuideFactory.create expectations
        // GuideFactory expects: id, name, description, isPublic, biblicalReferences, guideSections, authorId, createdAt, updatedAt
        const guideData = {
            id: guideVersion.guide.id,
            name: guideVersion.name,
            description: guideVersion.description,
            isPublic: guideVersion.guide.isPublic,
            authorId: guideVersion.guide.authorId,
            guideSections: (guideVersion.sections || []).map((section: any) => ({
                id: section.id,
                ordinalPosition: section.ordinalPosition,
                title: section.title,
                description: section.description,
                biblicalReferences: (section.biblicalReferences || []).map((ref: any) => ({
                    id: ref.id,
                    book: ref.book,
                    chapter: ref.chapter,
                    startVerse: ref.startVerse,
                    endVerse: ref.endVerse,
                })),
            })),
            biblicalReferences: (guideVersion.biblicalReferences || []).map((ref: any) => ({
                id: ref.id,
                book: ref.book,
                chapter: ref.chapter,
                startVerse: ref.startVerse,
                endVerse: ref.endVerse,
            })),
            createdAt: guideVersion.guide.createdAt || new Date(),
            updatedAt: guideVersion.guide.updatedAt || new Date(),
        };

        const guide = GuideMapper.mapGuideModelToDomain(guideData);
        const sourceGuide = GuideMapper.mapGuideToInterface(guide);
        
        // Map journey sections if they exist (PersonalJourneySection)
        // TODO: Implement PersonalJourneySection mapping when JourneySection domain model is available
        const sections: any[] = [];

        return JourneyFactory.create({
            id: prismaJourney.id,
            name: prismaJourney.name,
            ownerId: prismaJourney.ownerId ?? 0,
            sourceGuide: sourceGuide,
            sections: sections,
            createdAt: prismaJourney.createdAt,
            updatedAt: prismaJourney.updatedAt || prismaJourney.createdAt,
        });
    }

}