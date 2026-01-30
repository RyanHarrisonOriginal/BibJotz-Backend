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
            const draftData = await uow.drafts.findDraftByDraftKey(command.draftKey);
            if (!draftData) {
                throw new Error('Draft not found');
            }
            const draft = DraftMapper.mapDraftModelToDomain(draftData);
            draft.publish();
            const guide = DraftMapper.mapDraftToGuide(draft);
            const savedGuideData = await uow.guides.save(guide);
            const fullGuideData = await uow.guides.findGuideById(savedGuideData.guideRoot || savedGuideData.guideVersion?.guideId);
            await uow.drafts.save(draft);
            return;
        });
    }
}