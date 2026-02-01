import { IQuery } from "@/domain/shared/interfaces/query.interface";
import { IGuideIdParamsDTO } from "@/domain/Guide/guide.dto";

function parseId(v: string | undefined): number {
    if (v == null || v === "") return 0;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? 0 : n;
}

export class GetGuideByIdQuery implements IQuery {
    readonly queryType = 'GetGuideByIdQuery';

    constructor(public readonly guideId: number) {}

    /** Parse HTTP params DTO. Controllers call GetGuideByIdQuery.from(req.params). */
    static from(dto: IGuideIdParamsDTO): GetGuideByIdQuery {
        return new GetGuideByIdQuery(parseId(dto.guideId));
    }
}
