import { IJourneyRepository } from "@/domain/Jouney/journey-repository.interface";
import { GetJourneyLibraryQuery } from "@/domain/Jouney/commands/queries/get-journey-library/get-journey-library.query";
import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";
import { JourneyMapper, JourneyLibraryItem } from "@/domain/Jouney/journey.mapper";

export class GetJourneyLibraryQueryHandler implements IQueryHandler<GetJourneyLibraryQuery, JourneyLibraryItem[]> {
    constructor(private readonly journeyRepository: IJourneyRepository) {}

    async execute(query: GetJourneyLibraryQuery): Promise<JourneyLibraryItem[]> {
        const rows = await this.journeyRepository.getJourneyLibrary(query.ownerId);
        return JourneyMapper.mapJourneyLibraryRowsToItems(rows);
    }
}
