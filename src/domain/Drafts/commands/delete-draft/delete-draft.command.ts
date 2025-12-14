import { ICommand } from "@/domain/shared/interfaces/command.interface";

export class DeleteDraftCommand implements ICommand {
    readonly commandType = 'DeleteDraftCommand';

    constructor(public readonly draftId: number) {}
}

