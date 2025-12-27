
import { CreateDraftCommand } from "./create-draft.command";
import { Draft } from "@/domain/Drafts/draft";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { DraftFactory } from "@/domain/Drafts/draft-factory";
import { GuideDraftRunner } from "@/infrastructure/transactions/runners/guide-draft.runner";

export class CreateDraftCommandHandler implements ICommandHandler<CreateDraftCommand, Draft> {
    constructor(private readonly draftRunner: GuideDraftRunner) {}

    async execute(command: CreateDraftCommand): Promise<Draft> {
        return await this.draftRunner.run(async (uow) => {
        const draft = DraftFactory.create({
            name: command.name,
            userId: command.userId,
            draftKey: command.draftKey,
            draftContent: command.draftContent,
            updatedAt: new Date(),
            });
            await uow.drafts.save(draft);
            return draft;
        });

    }
}

