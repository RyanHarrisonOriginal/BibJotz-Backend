import { ICommand } from "@/domain/shared/interfaces/command.interface";

export class UpdateDraftCommand implements ICommand {
    readonly commandType = 'UpdateDraftCommand';

    constructor(
        public readonly draftKey: string,
        public readonly draftContent?: Record<string, any>,
    ) {}
}

