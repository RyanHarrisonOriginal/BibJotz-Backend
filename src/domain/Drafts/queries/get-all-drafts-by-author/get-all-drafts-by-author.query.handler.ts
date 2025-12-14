import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { GetAllDraftsByAuthorQuery } from "./get-all-drafts-by-author.query";
import { Draft } from "@/domain/Drafts/draft";
import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";

export class GetAllDraftsByAuthorQueryHandler implements IQueryHandler<GetAllDraftsByAuthorQuery, Partial<Draft>[]> {
    constructor(private readonly draftRepository: IDraftRepository) {}

    async execute(query: GetAllDraftsByAuthorQuery): Promise<Partial<Draft>[]> {
        return await this.draftRepository.findAllDraftsByUserId(query.userId);
    }
}

