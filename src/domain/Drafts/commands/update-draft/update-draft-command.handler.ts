import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { UpdateDraftCommand } from "./update-draft.command";
import { Draft } from "@/domain/Drafts/draft";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { GuideDraftRunner } from "@/infrastructure/transactions/runners/guide-draft.runner";

export class UpdateDraftCommandHandler implements ICommandHandler<UpdateDraftCommand, Draft> {
    constructor(private readonly draftRunner: GuideDraftRunner) {}

    async execute(command: UpdateDraftCommand): Promise<Draft> {
        return await this.draftRunner.run(async (uow) => {
            const draft = await uow.drafts.findDraftByDraftKey(command.draftKey);
            if (!draft) {
                throw new Error('Draft not found');
            }
            draft.updateDraftContent(command.draftContent ?? {});
            await uow.drafts.save(draft);
            return draft;
        });
    }
}
