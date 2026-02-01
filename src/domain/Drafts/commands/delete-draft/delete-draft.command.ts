import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IDraftKeyParamsDTO } from "@/domain/Drafts/draft.dto";

export class DeleteDraftCommand implements ICommand {
    readonly commandType = 'DeleteDraftCommand';

    constructor(public readonly draftKey: string) {}

    /** Parse HTTP params DTO. Controllers call DeleteDraftCommand.from(req.params). */
    static from(dto: IDraftKeyParamsDTO): DeleteDraftCommand {
        return new DeleteDraftCommand(dto.draftKey ?? "");
    }
}

