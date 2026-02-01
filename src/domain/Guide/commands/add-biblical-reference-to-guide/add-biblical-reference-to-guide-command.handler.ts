import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { AddBiblicalReferenceToGuideCommand } from "./add-biblical-reference-to-guide.command";
import { Guide } from "@/domain/Guide/guide";
import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { BiblicalReferenceFactory } from "@/domain/BiblicalReferences/biblical-reference-factory";
import { GuideMapper } from "@/domain/Guide/guide.mapper";

export class AddBiblicalReferenceToGuideCommandHandler implements ICommandHandler<AddBiblicalReferenceToGuideCommand, Guide> {
    constructor(
        private readonly guideRepository: IGuideRepository
    ) {}

    async execute(command: AddBiblicalReferenceToGuideCommand): Promise<Guide> {
        const biblicalReferences =  BiblicalReferenceFactory.createArray(command.biblicalReferences);
        const guideData = await this.guideRepository.findGuideById(command.guideId);
        const guide = GuideMapper.mapGuideModelToDomain(guideData);
        guide.addBiblicalReferences(biblicalReferences);
        const savedGuideData = await this.guideRepository.save(guide);
        const fullGuideData = await this.guideRepository.findGuideById(savedGuideData.guideRoot || savedGuideData.guideVersion?.guideId);
        return GuideMapper.mapGuideModelToDomain(fullGuideData);
    }
}