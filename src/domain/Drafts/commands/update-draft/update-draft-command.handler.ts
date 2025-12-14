import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { UpdateDraftCommand } from "./update-draft.command";
import { Draft } from "@/domain/Drafts/draft";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";

export class UpdateDraftCommandHandler implements ICommandHandler<UpdateDraftCommand, Draft> {
    constructor(private readonly draftRepository: IDraftRepository) {}

    async execute(command: UpdateDraftCommand): Promise<Draft> {
        const draft = await this.draftRepository.findDraftByDraftKey(command.draftKey);
        
        if (!draft) {
            throw new Error('Draft not found');
        }
        
        draft.updateDraftContent(command.draftContent ?? {});
        return await this.draftRepository.save(draft);
    }
}
