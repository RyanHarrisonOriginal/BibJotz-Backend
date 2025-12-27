import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";
import { IGuideRepository } from "../../guide-repository.interface";
import { GuideListItem } from "../../guide.interface";
import { GetGuideListQuery } from "./get-guide-list.query";


export class GetGuideListQueryHandler implements IQueryHandler<GetGuideListQuery, GuideListItem[]> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(query: GetGuideListQuery): Promise<GuideListItem[]> {
        return await this.guideRepository.getGuideList();
    }
}