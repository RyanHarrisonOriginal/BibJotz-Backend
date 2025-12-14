import { IQuery } from "@/domain/shared/interfaces/query.interface";

export class GetAllDraftsByAuthorQuery implements IQuery {
    readonly queryType = 'GetAllDraftsByAuthorQuery';

    constructor(public readonly userId: number) {}
}

