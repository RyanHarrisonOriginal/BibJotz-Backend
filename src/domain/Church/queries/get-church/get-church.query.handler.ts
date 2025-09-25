import { IChurchRepository } from "@/domain/Church/church-repository.interface";
import { GetChurchQuery } from "../get-church.query";
import { Church } from "@/domain/Church/church";
import { IQueryHandler } from "@/domain/shared/interfaces/query-handler.interface";

export class GetChurchQueryHandler implements IQueryHandler<GetChurchQuery, Church | Church[]> {
    constructor(private readonly churchRepository: IChurchRepository) {}

    async execute(query: GetChurchQuery): Promise<Church | Church[]> {
        if (query.id) {
            return await this.churchRepository.findById(query.id);
        }
        
        if (query.name) {
            return await this.churchRepository.findByName(query.name);
        }
        
        if (query.city) {
            return await this.churchRepository.findByCity(query.city);
        }
        
        if (query.state) {
            return await this.churchRepository.findByState(query.state as any);
        }
        
        if (query.zip) {
            return await this.churchRepository.findByZip(query.zip);
        }
        
        // If no specific criteria, return all churches (you might want to implement findAll in repository)
        throw new Error('At least one search criteria must be provided');
    }
}
