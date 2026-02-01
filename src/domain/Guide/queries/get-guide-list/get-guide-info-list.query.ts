import { IQuery } from "@/domain/shared/interfaces/query.interface";

export interface IGetGuideInfoListRequestDTO {
    userId: number;
}

export class GetGuideInfoListQuery implements IQuery {
    readonly queryType = 'GetGuideInfoListQuery';

    constructor(public readonly userId: number    ) {}

    static from(dto: IGetGuideInfoListRequestDTO): GetGuideInfoListQuery {
        return new GetGuideInfoListQuery(dto.userId);
    }
}