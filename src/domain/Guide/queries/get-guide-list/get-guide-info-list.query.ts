import { IQuery } from "@/domain/shared/interfaces/query.interface";

export class GetGuideInfoListQuery implements IQuery {
    readonly queryType = 'GetGuideInfoListQuery';
    
    constructor(public readonly userId: number) {}
}