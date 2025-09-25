import { IChurchRepository } from "@/domain/Church/church-repository.interface";
import { GetAllChurchesQuery } from "./get-all-churches.query";
import { Church } from "@/domain/Church/church";
import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";

export class GetAllChurchesQueryHandler implements IQueryHandler<GetAllChurchesQuery, Church[]> {
    constructor(private readonly churchRepository: IChurchRepository) {}

    async execute(query: GetAllChurchesQuery): Promise<Church[]> {
        // For now, we'll need to implement findAll in the repository
        // This is a placeholder - you might want to implement pagination
        return await this.churchRepository.findAll();
    }
}
