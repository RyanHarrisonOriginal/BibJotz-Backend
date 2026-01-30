import { Journey } from "@/domain/Jouney/jouney";

export interface IJourneyRepository {
    save(journey: Journey): Promise<any>;
    findJourney(journeyId?: number): Promise<any>;
    findJourneys(journeyId?: number, ownerId?: number, guideId?: number): Promise<any[]>;
}