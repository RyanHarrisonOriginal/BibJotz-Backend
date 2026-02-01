import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IUpdateDraftRequestDTO } from "@/domain/Drafts/draft.dto";

export class UpdateDraftCommand implements ICommand {
    readonly commandType = 'UpdateDraftCommand';

    constructor(
        public readonly draftKey: string,
        public readonly draftContent?: Record<string, unknown>,
    ) {}

    /** Parse HTTP request (params + body). Controllers call UpdateDraftCommand.from({ draftKey: req.params.draftKey, draftContent: req.body.draftContent }). */
    static from(dto: IUpdateDraftRequestDTO): UpdateDraftCommand {
        return new UpdateDraftCommand(dto.draftKey ?? "", dto.draftContent);
    }
}

