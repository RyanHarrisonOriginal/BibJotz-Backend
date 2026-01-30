import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { GetAllDraftsByAuthorQuery } from "./get-all-drafts-by-author.query";
import { Draft } from "@/domain/Drafts/draft";
import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";
import { DraftMapper } from "@/domain/Drafts/draft.mapper";

export class GetAllDraftsByAuthorQueryHandler implements IQueryHandler<GetAllDraftsByAuthorQuery, Draft[]> {
    constructor(private readonly draftRepository: IDraftRepository) {}

    async execute(query: GetAllDraftsByAuthorQuery): Promise<Draft[]> {
        const draftsData = await this.draftRepository.findAllDraftsByUserId(query.userId);
        return draftsData.map(draft => DraftMapper.mapDraftModelToDomain(draft));
    }
}

