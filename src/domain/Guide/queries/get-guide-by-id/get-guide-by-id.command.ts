import { IQuery } from "@/domain/shared/interfaces/query.interface";

export class GetGuideByIdQuery implements IQuery {
    readonly queryType = 'GetGuideByIdQuery';

    constructor(public readonly guideId: number) {}
}
