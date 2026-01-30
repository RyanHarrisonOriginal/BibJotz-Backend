import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { AddGuideSectionCommand } from "@/domain/Guide/commands/add-guide-section/add-guide-section.command";
import { GuideSection } from "@/domain/Guide/Sections/guide-section";
import { GuideSectionFactory } from "@/domain/Guide/Sections/guide-section-factory";
import { GuideMapper } from "@/domain/Guide/guide.mapper";

export class AddGuideSectionCommandHandler implements ICommandHandler<AddGuideSectionCommand, GuideSection> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(command: AddGuideSectionCommand): Promise<GuideSection> {
        const guideData = await this.guideRepository.findGuideById(command.guideId);
        const guide = GuideMapper.mapGuideModelToDomain(guideData);
        const ordinalPosition = guide.getGuideSections().length + 1;
        const guideSection = GuideSectionFactory.create({
            id: null,
            ordinalPosition: ordinalPosition,
            title: command.guideSection.title,
            description: command.guideSection.description,
            biblicalReferences: command.guideSection.biblicalReferences,
        });
        guide.addGuideSection(guideSection);
        await this.guideRepository.save(guide);
        return guideSection;    
    }
}