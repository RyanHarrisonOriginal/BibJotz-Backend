import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { DeleteDraftCommand } from "./delete-draft.command";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";

export class DeleteDraftCommandHandler implements ICommandHandler<DeleteDraftCommand, void> {
    constructor(private readonly draftRepository: IDraftRepository) {}

    async execute(command: DeleteDraftCommand): Promise<void> {
        await this.draftRepository.delete(command.draftId);
    }
}

