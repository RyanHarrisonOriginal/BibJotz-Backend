import { Reflection } from "../Reflection/reflection";
import { Journey } from "./jouney";

export class JourneyMapper {

    private static arrayMapper<T>(array: any[], mapper: (item: any) => T): T[] {
        if (!array) {
            return [];
        }
        return array.map((item: any) => mapper(item));
    }

    public static mapReflectionToPersistenceModel(reflection: Reflection, journeyId: number): any {
        return {
            id: reflection.getId(),
            content: reflection.getContent(),
            userId: reflection.getUserId(),
            journeyId: journeyId,
        };
    }

    public static mapJourneyToPersistencePrisma(journey: Journey): any {
        const reflections = JourneyMapper.arrayMapper(
            journey.getReflections(), 
            (item) => JourneyMapper.mapReflectionToPersistenceModel(item, journey.getId() ?? 0)
        );
        return {
            id: journey.getId(),
            title: journey.getTitle(),
            ownerId: journey.getOwnerId(),
            guideId: journey.getGuide().id,
            reflections: reflections,
        };
    }

    public static mapJourneyModelToDomain(journey: any): Journey {
        return new Journey(
            journey.id,
            journey.title,
            journey.ownerId,
            journey.guideId,
            journey.reflections,
        );
    }

}