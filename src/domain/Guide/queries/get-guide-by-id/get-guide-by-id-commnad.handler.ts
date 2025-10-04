import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { GetGuideByIdQuery } from "./get-guide-by-id.command";
import { Guide } from "@/domain/Guide/guide";
import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";

export class GetGuideByIdCommandHandler implements IQueryHandler<GetGuideByIdQuery, Guide> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(query: GetGuideByIdQuery): Promise<Guide> {
        return await this.guideRepository.findGuideById(query.guideId);
    }
}