import { IChurchRepository } from "@/domain/Church/church-repository.interface";
import { CreateChurchCommand } from "./create-church.command";
import { Church } from "@/domain/Church/church";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { ChurchFactory } from "@/domain/Church/church-factory";

export class CreateChurchCommandHandler implements ICommandHandler<CreateChurchCommand, Church> {
    constructor(private readonly churchRepository: IChurchRepository) {}

    async execute(command: CreateChurchCommand): Promise<Church> {
        const church = ChurchFactory.create(command);
        return this.churchRepository.save(church);
    }
}   
