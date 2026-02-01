import { IQuery } from "@/domain/shared/interfaces/query.interface";
import { IFindJourneyQueryParamsDTO } from "@/domain/Jouney/journey.dto";

export class FindJourneyQuery implements IQuery {
    readonly queryType = 'FindJourneyQuery';

    constructor(
        public readonly journeyId?: number,
        public readonly ownerId?: number,
        public readonly guideId?: number,
    ) {}

    static from(dto: IFindJourneyQueryParamsDTO): FindJourneyQuery {
        const parse = (v: string | string[] | undefined): number | undefined => {
            if (v == null || v === "") return undefined;
            const n = parseInt(String(v), 10);
            return Number.isNaN(n) ? undefined : n;
        };
        return new FindJourneyQuery(
            parse(dto.id),
            parse(dto.ownerId),
            parse(dto.guideId),
        );
    }
}