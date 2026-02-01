import { IQuery } from "@/domain/shared/interfaces/query.interface";
import { IDraftKeyParamsDTO } from "@/domain/Drafts/draft.dto";

export class GetDraftByDraftKeyQuery implements IQuery {
    readonly queryType = 'GetDraftByDraftKeyQuery';

    constructor(public readonly draftKey: string) {}

    /** Parse HTTP params DTO. Controllers call GetDraftByDraftKeyQuery.from(req.params). */
    static from(dto: IDraftKeyParamsDTO): GetDraftByDraftKeyQuery {
        return new GetDraftByDraftKeyQuery(dto.draftKey ?? "");
    }
}

