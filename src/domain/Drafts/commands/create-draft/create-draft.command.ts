import { ICommand } from "@/domain/shared/interfaces/command.interface";

export class CreateDraftCommand implements ICommand {
    readonly commandType = 'CreateDraftCommand';

    constructor(
        public readonly userId: number,
        public readonly name: string,
        public readonly draftKey: string,
        public readonly draftContent: Record<string, any>,
    ) {}
}

