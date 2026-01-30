import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { CreateGuideCommand } from "./create-guide.command";
import { Guide } from "@/domain/Guide/guide";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { GuideFactory } from "@/domain/Guide/guide-factory";
import { GuideMapper } from "@/domain/Guide/guide.mapper";

export class CreateGuideCommandHandler implements ICommandHandler<CreateGuideCommand, Guide> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(command: CreateGuideCommand): Promise<Guide> {
        const guide = GuideFactory.create({
            id: null,
            name: command.name,
            description: command.description,
            isPublic: command.isPublic,
            biblicalReferences: command.biblicalReferences ?? [],
            guideSections: command.guideSections ?? [],
            authorId: command.authorId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const savedGuideData = await this.guideRepository.save(guide);
        const fullGuideData = await this.guideRepository.findGuideById(savedGuideData.guideRoot || savedGuideData.guideVersion?.guideId);
        return GuideMapper.mapGuideModelToDomain(fullGuideData);
    }
}