import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { CreateDraftCommand } from "./create-draft.command";
import { Draft } from "@/domain/Drafts/draft";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { DraftFactory } from "@/domain/Drafts/draft-factory";

export class CreateDraftCommandHandler implements ICommandHandler<CreateDraftCommand, Draft> {
    constructor(private readonly draftRepository: IDraftRepository) {}

    async execute(command: CreateDraftCommand): Promise<Draft> {
        try {
        const draft = DraftFactory.create({
            name: command.name,
            userId: command.userId,
            draftKey: command.draftKey,
            draftContent: command.draftContent,
            updatedAt: new Date(),
            });
            return this.draftRepository.save(draft);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to create draft');
        }
    }
}

