import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { PublishDraftCommand } from "./publish-draft.command";
import { GuideDraftPublishingRunner } from "@/infrastructure/transactions/runners/guide-draft-publishing.runner";
import { DraftMapper } from "../../draft.mapper";

export class PublishDraftCommandHandler implements ICommandHandler<PublishDraftCommand, void> {

    constructor(
        private readonly runner: GuideDraftPublishingRunner
    ) {}

    async execute(command: PublishDraftCommand): Promise<void> {
        await this.runner.run(async (uow) => {
        const draft = await uow.drafts.findDraftByDraftKey(command.draftKey);
        if (!draft) {
            throw new Error('Draft not found');
        }
        draft.publish();
        const guide = DraftMapper.mapDraftToGuide(draft);
        console.log(guide);
        console.log(draft);
        await uow.guides.save(guide);
        await uow.drafts.save(draft);
        return;
    });
    }
}