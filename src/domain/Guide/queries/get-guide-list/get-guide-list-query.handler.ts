import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";
import { IGuideRepository } from "../../guide-repository.interface";
import { GuideListPayload } from "../../guide.interface";
import { GetGuideListQuery } from "./get-guide-list.query";


export class GetGuideListQueryHandler implements IQueryHandler<GetGuideListQuery, GuideListPayload> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(query: GetGuideListQuery): Promise<GuideListPayload> {
        return await this.guideRepository.getGuideList(query.userId);
    }   
}