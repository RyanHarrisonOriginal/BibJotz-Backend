import { IJourneyRepository } from "@/domain/Jouney/journey-repository.interface";
import { FindJourneyQuery } from "@/domain/Jouney/commands/queries/find-journey/find-journey.query";
import { Journey } from "@/domain/Jouney/jouney";
import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";
import { JourneyMapper } from "@/domain/Jouney/journey.mapper";

export class FindJourneyQueryHandler implements IQueryHandler<FindJourneyQuery, Journey[]> {
    constructor(private readonly journeyRepository: IJourneyRepository) {}

    async execute(query: FindJourneyQuery): Promise<Journey[]> {
        const journeysData = await this.journeyRepository.findJourneys(
            query.journeyId ?? undefined,
            query.ownerId ?? undefined,
            query.guideId ?? undefined
        );
        return journeysData.map(journey => JourneyMapper.mapJourneyModelToDomain(journey));
    }
}