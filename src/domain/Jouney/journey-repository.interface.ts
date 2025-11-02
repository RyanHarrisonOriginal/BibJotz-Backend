import { Journey } from "./jouney";

export interface IJourneyRepository {
    save(journey: Journey): Promise<Journey>;
    findJourney(journeyId?: number): Promise<Journey>;
    findJourneys(journeyId?: number, ownerId?: number, guideId?: number): Promise<Journey[]>;
}