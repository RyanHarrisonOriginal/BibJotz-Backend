import { Reflection } from "@/domain/Reflection/reflection";
import { Journey } from "@/domain/Jouney/jouney";

export class JourneyMapper {

    public static mapReflectionToPersistenceModel(reflection: Reflection, journeyId: number): any {
        return {
            id: reflection.getId(),
            content: reflection.getContent(),
            authorId: reflection.getAuthorId(),
            guideSectionId: reflection.getGuideSectionId(),
            journeyId: journeyId,
        };
    }

    public static mapReflectionsToPersistenceModel(reflections: Reflection[], journeyId: number): any[] {
        return reflections.map((reflection) => JourneyMapper.mapReflectionToPersistenceModel(reflection, journeyId));
    }

    public static mapJourneyToPersistencePrisma(journey: Journey): any {
        const reflections = JourneyMapper.mapReflectionsToPersistenceModel(journey.getReflections(), journey.getId() ?? 0);
        return {
            id: journey.getId(),
            title: journey.getTitle(),
            ownerId: journey.getOwnerId(),
            guideId: journey.getGuideId(),
            reflections: reflections,
        };
    }

}