import { IQuery } from "@/domain/shared/interfaces/query.interface";

export class GetDraftByDraftKeyQuery implements IQuery {
    readonly queryType = 'GetDraftByDraftKeyQuery';

    constructor(public readonly draftKey: string) {}
}

