import { IChurchRepository } from "@/domain/Church/church-repository.interface";
import { CreateChurchCommand } from "./create-church.command";
import { Church } from "@/domain/Church/church";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { ChurchFactory } from "@/domain/Church/church-factory";
import { ChurchMapper } from "@/domain/Church/church.mapper";

export class CreateChurchCommandHandler implements ICommandHandler<CreateChurchCommand, Church> {
    constructor(private readonly churchRepository: IChurchRepository) {}

    async execute(command: CreateChurchCommand): Promise<Church> {
        const church = ChurchFactory.create(command);
        const savedChurchData = await this.churchRepository.save(church);
        return ChurchMapper.mapChurchToDomain(savedChurchData);
    }
}   
