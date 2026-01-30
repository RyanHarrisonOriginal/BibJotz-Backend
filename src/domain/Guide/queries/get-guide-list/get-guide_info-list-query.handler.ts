import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";
import { IGuideRepository } from "../../guide-repository.interface";
import { IGuideListPayload } from "../../guide.interface";
import { GetGuideInfoListQuery } from "./get-guide-info-list.query";
import { GuideMapper } from "../../guide.mapper";


export class GetGuideInfoListQueryHandler implements IQueryHandler<GetGuideInfoListQuery, IGuideListPayload> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(query: GetGuideInfoListQuery): Promise<IGuideListPayload> {
        const rawData = await this.guideRepository.getGuideInfoListRaw(query.userId);
        return GuideMapper.mapGuideListPayloadToDomain(rawData.guides, rawData.counts);
    }   
}