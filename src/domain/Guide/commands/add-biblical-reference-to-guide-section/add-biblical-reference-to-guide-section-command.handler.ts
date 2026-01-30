import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { AddBiblicalReferenceToGuideSectionCommand } from "./add-biblical-reference-to-guide-section.command";
import { GuideSection } from "../../guide-section";
import { IGuideRepository } from "../../guide-repository.interface";
import { BiblicalReferenceMapper } from "@/domain/BiblicalReferences/biblical-reference.mapper";
import { Guide } from "../../guide";
import { GuideMapper } from "../../guide.mapper";

export class AddBiblicalReferenceToGuideSectionCommandHandler implements ICommandHandler<AddBiblicalReferenceToGuideSectionCommand, Guide> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(command: AddBiblicalReferenceToGuideSectionCommand): Promise<Guide> {
        const biblicalReferences = BiblicalReferenceMapper.mapBiblicalReferencesToDomain(command.biblicalReferences);
        const guideData = await this.guideRepository.findGuideById(command.guideId);
        const guide = GuideMapper.mapGuideModelToDomain(guideData);
        const guideSection = guide.getGuideSectionById(command.sectionId);
        if (!guideSection) {
            throw new Error('Guide section not found');
        }
        guideSection.addBiblicalReferences(biblicalReferences);
        const savedGuideData = await this.guideRepository.save(guide);
        // Fetch the full guide after save
        const fullGuideData = await this.guideRepository.findGuideById(savedGuideData.guideRoot || savedGuideData.guideVersion?.guideId);
        return GuideMapper.mapGuideModelToDomain(fullGuideData);
    }
}
