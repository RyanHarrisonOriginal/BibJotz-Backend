import { IQuery } from "@/domain/shared/interfaces/query.interface";

export class FindJourneyQuery implements IQuery {
    readonly queryType = 'FindJourneyQuery';

    constructor(
        public readonly journeyId?: number,
        public readonly ownerId?: number,
        public readonly guideId?: number,
    ) {}
}