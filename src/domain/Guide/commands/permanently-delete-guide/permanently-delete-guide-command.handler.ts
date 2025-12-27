import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { IGuideRepository } from "../../guide-repository.interface";
import { PermanentlyDeleteGuideCommand } from "./permanently-delete-guide.command";



export class PermanentlyDeleteGuideCommandHandler implements ICommandHandler<PermanentlyDeleteGuideCommand, void> {
    constructor(private readonly guideRepository: IGuideRepository) {}

    async execute(command: PermanentlyDeleteGuideCommand): Promise<void> {
        await this.guideRepository.deleteGuide(command.guideId, command.userId);
    }
}