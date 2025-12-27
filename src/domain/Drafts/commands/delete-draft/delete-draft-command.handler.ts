
import { DeleteDraftCommand } from "./delete-draft.command";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { GuideDraftRunner } from "@/infrastructure/transactions/runners/guide-draft.runner";

export class DeleteDraftCommandHandler implements ICommandHandler<DeleteDraftCommand, void> {
    constructor(private readonly draftRunner: GuideDraftRunner) {}

    async execute(command: DeleteDraftCommand): Promise<void> {
        await this.draftRunner.run(async (uow) => {
            await uow.drafts.delete(command.draftKey);
            return;
        });
    }
}

