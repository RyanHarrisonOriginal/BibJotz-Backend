import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { CreateGuideCommand } from "./create-guide.command";
import { Guide } from "@/domain/Guide/guide";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { GuideFactory } from "@/domain/Guide/guide-factory";

export class CreateGuideCommandHandler implements ICommandHandler<CreateGuideCommand, Guide> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(command: CreateGuideCommand): Promise<Guide> {
        const guide = GuideFactory.create({
            id: null,
            name: command.name,
            description: command.description,
            isPublic: command.isPublic,
            biblicalReferences: command.biblicalReferences,
            guideSections: command.guideSections,
        });
        return this.guideRepository.save(guide);
    }
}