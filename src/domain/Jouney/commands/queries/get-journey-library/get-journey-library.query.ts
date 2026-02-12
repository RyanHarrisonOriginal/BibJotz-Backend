import { IQuery } from "@/domain/shared/interfaces/query.interface";
import { IGetJourneyLibraryRequestDTO } from "@/domain/Jouney/journey.dto";

export class GetJourneyLibraryQuery implements IQuery {
    readonly queryType = 'GetJourneyLibraryQuery';

    constructor(public readonly ownerId: number | null) {}

    static from(dto: IGetJourneyLibraryRequestDTO): GetJourneyLibraryQuery {
        const parse = (v: string | string[] | undefined): number | null => {
            if (v == null || v === "") return null;
            const n = parseInt(String(v), 10);
            return Number.isNaN(n) ? null : n;
        };
        const ownerId = dto.ownerId != null ? parse(dto.ownerId) : null;
        return new GetJourneyLibraryQuery(ownerId);
    }
}
