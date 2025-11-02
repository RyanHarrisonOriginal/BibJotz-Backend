import { Reflection } from "../Reflection/reflection";
import { Journey } from "./jouney";
import { ReflectionFactory } from "../Reflection/reflection-factory";
import { JourneyFactory } from "./journey-factory";

export class JourneyMapper {

    private static arrayMapper<T>(array: any[], mapper: (item: any) => T): T[] {
        console.log('array', array);
        if (!array) {
            return [];
        }
        return array.map((item: any) => mapper(item));
    }

    public static mapReflectionToPersistenceModel(reflection: Reflection, journeyId: number): any {
        return {
            id: reflection.getId(),
            content: reflection.getContent(),
            authorId: reflection.getAuthorId(),
            guideSectionId: reflection.getGuideSectionId(),
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
            guideId: journey.getGuideId(),
            reflections: reflections,
        };
    }

    public static mapJourneyModelToDomain(journey: any): Journey {
        console.log('journey---->fricking', journey);
        return JourneyFactory.create(journey);
    }
}