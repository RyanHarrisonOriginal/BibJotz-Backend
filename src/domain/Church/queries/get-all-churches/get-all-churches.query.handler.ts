import { IChurchRepository } from "@/domain/Church/church-repository.interface";
import { GetAllChurchesQuery } from "./get-all-churches.query";
import { Church } from "@/domain/Church/church";
import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";
import { ChurchMapper } from "@/domain/Church/church.mapper";

export class GetAllChurchesQueryHandler implements IQueryHandler<GetAllChurchesQuery, Church[]> {
    constructor(private readonly churchRepository: IChurchRepository) {}

    async execute(query: GetAllChurchesQuery): Promise<Church[]> {
        const churchesData = await this.churchRepository.findAll();
        return churchesData.map(church => ChurchMapper.mapChurchToDomain(church));
    }
}
