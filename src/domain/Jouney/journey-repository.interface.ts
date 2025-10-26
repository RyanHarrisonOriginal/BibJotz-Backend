import { Journey } from "./jouney";

export interface IJourneyRepository {
    save(journey: Journey): Promise<Journey>;
    findJourneyById(id: number): Promise<Journey>;
    findJourneysByOwnerId(ownerId: number): Promise<Journey[]>;
    findJourneysByGuideId(guideId: number): Promise<Journey[]>;
}