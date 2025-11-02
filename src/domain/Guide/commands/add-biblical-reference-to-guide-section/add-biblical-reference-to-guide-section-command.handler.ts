import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { AddBiblicalReferenceToGuideSectionCommand } from "./add-biblical-reference-to-guide-section.command";
import { GuideSection } from "../../guide-section";
import { IGuideRepository } from "../../guide-repository.interface";
import { BiblicalReferenceMapper } from "@/domain/BiblicalReferences/biblical-reference.mapper";
import { Guide } from "../../guide";

export class AddBiblicalReferenceToGuideSectionCommandHandler implements ICommandHandler<AddBiblicalReferenceToGuideSectionCommand, Guide> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(command: AddBiblicalReferenceToGuideSectionCommand): Promise<Guide> {
        const biblicalReferences = BiblicalReferenceMapper.mapBiblicalReferencesToDomain(command.biblicalReferences);
        const guide = await this.guideRepository.findGuideById(command.guideId);
        const guideSection = guide.getGuideSectionById(command.sectionId);
        if (!guideSection) {
            throw new Error('Guide section not found');
        }
        guideSection.addBiblicalReferences(biblicalReferences);
        await this.guideRepository.save(guide);
        return guide;
    }
}
