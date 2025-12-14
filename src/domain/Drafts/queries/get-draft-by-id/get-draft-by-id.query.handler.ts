import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { GetDraftByDraftKeyQuery } from "./get-draft-by-id.query";
import { Draft } from "@/domain/Drafts/draft";
import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";

export class GetDraftByDraftKeyQueryHandler implements IQueryHandler<GetDraftByDraftKeyQuery, Draft> {
    constructor(private readonly draftRepository: IDraftRepository) {}

    async execute(query: GetDraftByDraftKeyQuery): Promise<Draft> {
        return await this.draftRepository.findDraftByDraftKey(query.draftKey);
    }
}

