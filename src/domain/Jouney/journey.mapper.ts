import { Journey } from "@/domain/Jouney/jouney";
import { JourneyFactory } from "./journey-factory";
import { GuideMapper } from "@/domain/Guide/guide.mapper";

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
}