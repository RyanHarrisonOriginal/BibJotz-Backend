import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { UpdateDraftCommand } from "./update-draft.command";
import { Draft } from "@/domain/Drafts/draft";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { GuideDraftRunner } from "@/infrastructure/transactions/runners/guide-draft.runner";
import { DraftMapper } from "@/domain/Drafts/draft.mapper";

export class UpdateDraftCommandHandler implements ICommandHandler<UpdateDraftCommand, Draft> {
    constructor(
        private readonly runner: GuideDraftRunner
    ) { }

    async execute(command: UpdateDraftCommand): Promise<Draft> {
        return await this.runner.run(async (uow) => {
            const draftData = await uow.drafts.findDraftByDraftKey(command.draftKey);
            if (!draftData) {
                throw new Error('Draft not found');
            }
            const draft = DraftMapper.mapDraftModelToDomain(draftData);
            draft.updateDraftContent(command.draftContent ?? {});
            const savedDraftData = await uow.drafts.save(draft);
            return DraftMapper.mapDraftModelToDomain(savedDraftData);
        });
    }
}
