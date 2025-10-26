import { IGuideDTO } from "@/domain/Guide/guide.dto";
import { IReflectionDTO } from "@/domain/Reflection/reflection.dto";
import { ICommand } from "@/domain/shared/interfaces/command.interface";


export class CreateJourneyCommand implements ICommand {
    readonly commandType = 'CreateJourneyCommand';

    constructor(
        public readonly title: string,
        public readonly ownerId: number,
        public readonly guide: IGuideDTO,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}