
import { ICommand } from "@/domain/shared/interfaces/command.interface";


export class CreateJourneyCommand implements ICommand {
    readonly commandType = 'CreateJourneyCommand';

    constructor(
        public readonly name: string,
        public readonly ownerId: number,
        public readonly guideId: number,
    ) {}
}