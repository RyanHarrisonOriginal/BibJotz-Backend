import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { AddBiblicalReferenceToGuideCommand } from "./add-biblical-reference-to-guide.command";
import { Guide } from "@/domain/Guide/guide";
import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { BiblicalReferenceMapper } from "@/domain/BiblicalReferences/biblical-reference.mapper";

export class AddBiblicalReferenceToGuideCommandHandler implements ICommandHandler<AddBiblicalReferenceToGuideCommand, Guide> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(command: AddBiblicalReferenceToGuideCommand): Promise<Guide> {
        const biblicalReferences =  BiblicalReferenceMapper.mapBiblicalReferencesToDomain(command.biblicalReferences);
        const guide = await this.guideRepository.findGuideById(command.guideId);
        guide.addBiblicalReferences(biblicalReferences);
        await this.guideRepository.save(guide);
        return guide;
    }
}