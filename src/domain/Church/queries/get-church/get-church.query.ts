import { IQuery } from "@/domain/shared/interfaces/query.interface";
import { IGetChurchQueryParamsDTO } from "@/domain/Church/church.dto";

export class GetChurchQuery implements IQuery {
    readonly queryType = 'GetChurchQuery';

    constructor(
        public readonly id?: number,
        public readonly name?: string,
        public readonly city?: string,
        public readonly state?: string,
        public readonly zip?: string
    ) {}

    static from(dto: IGetChurchQueryParamsDTO): GetChurchQuery {
        const parseId = (v: string | string[] | undefined): number | undefined => {
            if (v == null || v === "") return undefined;
            const n = Number(Array.isArray(v) ? v[0] : v);
            return Number.isNaN(n) ? undefined : n;
        };
        return new GetChurchQuery(
            parseId(dto.id),
            dto.name,
            dto.city,
            dto.state,
            dto.zip,
        );
    }
}
