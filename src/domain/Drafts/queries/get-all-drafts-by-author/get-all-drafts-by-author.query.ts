import { IQuery } from "@/domain/shared/interfaces/query.interface";
import { IGetAllDraftsByAuthorParamsDTO } from "@/domain/Drafts/draft.dto";

export class GetAllDraftsByAuthorQuery implements IQuery {
    readonly queryType = 'GetAllDraftsByAuthorQuery';

    constructor(public readonly userId: number    ) {}

    static from(dto: IGetAllDraftsByAuthorParamsDTO): GetAllDraftsByAuthorQuery {
        const userId = parseInt(dto.userId ?? "0", 10);
        return new GetAllDraftsByAuthorQuery(Number.isNaN(userId) ? 0 : userId);
    }
}

