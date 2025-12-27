import { ICommand } from "@/domain/shared/interfaces/command.interface";

export class PermanentlyDeleteGuideCommand implements ICommand {
    readonly commandType = 'PermanentlyDeleteGuideCommand';

    constructor(
       public readonly guideId: number,
       public readonly userId: number,
    ) {}
}