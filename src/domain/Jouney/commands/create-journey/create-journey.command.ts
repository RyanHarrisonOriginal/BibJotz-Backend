
import { ICommand } from "@/domain/shared/interfaces/command.interface";


export class CreateJourneyCommand implements ICommand {
    readonly commandType = 'CreateJourneyCommand';

    constructor(
        public readonly title: string,
        public readonly ownerId: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly guideId: number,
    ) {}
}