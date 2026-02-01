import { IQuery } from "@/domain/shared/interfaces/query.interface";

/** Request DTO: userId from query or auth. Controllers pass { userId } (e.g. from middleware). */
export interface IGetGuideInfoListRequestDTO {
    userId: number;
}

export class GetGuideInfoListQuery implements IQuery {
    readonly queryType = 'GetGuideInfoListQuery';

    constructor(public readonly userId: number) {}

    /** Parse request. Controllers call GetGuideInfoListQuery.from({ userId }) with userId from middleware/query. */
    static from(dto: IGetGuideInfoListRequestDTO): GetGuideInfoListQuery {
        return new GetGuideInfoListQuery(dto.userId);
    }
}