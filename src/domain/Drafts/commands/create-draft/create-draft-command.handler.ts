import { CreateDraftCommand } from "./create-draft.command";
import { Draft } from "@/domain/Drafts/draft";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { DraftFactory } from "@/domain/Drafts/draft-factory";
import { GuideDraftRunner } from "@/infrastructure/transactions/runners/guide-draft.runner";
import { DraftMapper } from "@/domain/Drafts/draft.mapper";

export class CreateDraftCommandHandler implements ICommandHandler<CreateDraftCommand, Draft> {
    
    constructor(
        private readonly runner: GuideDraftRunner
    ) {}

    async execute(command: CreateDraftCommand): Promise<Draft> {
        return await this.runner.run(async (uow) => {
            const draft = DraftFactory.create({
                name: command.name,
                userId: command.userId,
                draftKey: command.draftKey,
                draftContent: command.draftContent,
                updatedAt: new Date(),
            });
            const savedDraftData = await uow.drafts.save(draft);
            return DraftMapper.mapDraftModelToDomain(savedDraftData);
        });
    }
}

