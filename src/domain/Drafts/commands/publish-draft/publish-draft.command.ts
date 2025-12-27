import { ICommand } from "@/domain/shared/interfaces/command.interface";


export class PublishDraftCommand implements ICommand {
    readonly commandType = 'PublishDraftCommand';

    constructor(public readonly draftKey: string) {}
}