import { IChurchRepository } from "@/domain/Church/church-repository.interface";
import { GetChurchQuery } from "@/domain/Church/queries/get-church/get-church.query";
import { Church } from "@/domain/Church/church";
import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";
import { ChurchMapper } from "@/domain/Church/church.mapper";

export class GetChurchQueryHandler implements IQueryHandler<GetChurchQuery, Church | Church[]> {
    constructor(private readonly churchRepository: IChurchRepository) {}

    async execute(query: GetChurchQuery): Promise<Church | Church[]> {
        let churchData: any;
        
        if (query.id) {
            churchData = await this.churchRepository.findById(query.id);
        } else if (query.name) {
            churchData = await this.churchRepository.findByName(query.name);
        } else if (query.city) {
            churchData = await this.churchRepository.findByCity(query.city);
        } else if (query.state) {
            churchData = await this.churchRepository.findByState(query.state as any);
        } else if (query.zip) {
            churchData = await this.churchRepository.findByZip(query.zip);
        } else {
            throw new Error('At least one search criteria must be provided');
        }
        
        return ChurchMapper.mapChurchToDomain(churchData);
    }
}
