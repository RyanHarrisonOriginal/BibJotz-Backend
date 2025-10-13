import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { AddBiblicalReferenceToGuideSectionCommand } from "./add-biblical-reference-to-guide-section.command";
import { Guide } from "@/domain/Guide/guide";
import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { GuideMapper } from "../../guide.mapper";

export class AddBiblicalReferenceToGuideSectionCommandHandler implements ICommandHandler<AddBiblicalReferenceToGuideSectionCommand, Guide> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(command: AddBiblicalReferenceToGuideSectionCommand): Promise<Guide> {
        const guide = await this.guideRepository.findGuideById(command.guideId);
        console.log(guide);
        const biblicalReferences = command.biblicalReferences.map((reference) =>
            GuideMapper.mapBiblicalReferenceModelToDomain(reference)
        );
        console.log(biblicalReferences);
        biblicalReferences.forEach((reference) => {
            guide.addBiblicalReferenceToSection(command.sectionId, reference);
        });
        return this.guideRepository.save(guide);
    }
}
