import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IDraftKeyParamsDTO } from "@/domain/Drafts/draft.dto";

export class PublishDraftCommand implements ICommand {
    readonly commandType = 'PublishDraftCommand';

    constructor(public readonly draftKey: string) {}

    /** Parse HTTP params DTO. Controllers call PublishDraftCommand.from(req.params). */
    static from(dto: IDraftKeyParamsDTO): PublishDraftCommand {
        return new PublishDraftCommand(dto.draftKey ?? "");
    }
}