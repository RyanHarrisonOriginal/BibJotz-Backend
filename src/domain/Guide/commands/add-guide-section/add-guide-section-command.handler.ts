import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { AddGuideSectionCommand } from "@/domain/Guide/commands/add-guide-section/add-guide-section.command";
import { GuideSection } from "@/domain/Guide/guide-section";
import { GuideMapper } from "@/domain/Guide/guide.mapper";

export class AddGuideSectionCommandHandler implements ICommandHandler<AddGuideSectionCommand, GuideSection> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(command: AddGuideSectionCommand): Promise<GuideSection> {
        const guide = await this.guideRepository.findById(command.guideId);
        const guideSection = GuideMapper.mapGuideSectionModelToDomain(command.guideSection);
        guide.addGuideSection(guideSection);
        await this.guideRepository.save(guide);
        return guideSection;
    }
}