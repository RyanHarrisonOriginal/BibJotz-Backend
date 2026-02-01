import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IJourneyDTO } from "@/domain/Jouney/journey.dto";

export class CreateJourneyCommand implements ICommand {
    readonly commandType = 'CreateJourneyCommand';

    constructor(
        public readonly name: string,
        public readonly ownerId: number,
        public readonly guideId: number,
    ) {}

    static from(dto: IJourneyDTO): CreateJourneyCommand {
        return new CreateJourneyCommand(
            dto.name,
            dto.userId,
            dto.guideId,
        );
    }
}