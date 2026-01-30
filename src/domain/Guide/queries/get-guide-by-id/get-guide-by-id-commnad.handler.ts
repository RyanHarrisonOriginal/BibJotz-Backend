import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { GetGuideByIdQuery } from "@/domain/Guide/queries/get-guide-by-id/get-guide-by-id.command";
import { Guide } from "@/domain/Guide/guide";
import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";
import { GuideMapper } from "@/domain/Guide/guide.mapper";

export class GetGuideByIdCommandHandler implements IQueryHandler<GetGuideByIdQuery, Guide> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(query: GetGuideByIdQuery): Promise<Guide> {
        const guideData = await this.guideRepository.findGuideById(query.guideId);
        return GuideMapper.mapGuideModelToDomain(guideData);
    }
}