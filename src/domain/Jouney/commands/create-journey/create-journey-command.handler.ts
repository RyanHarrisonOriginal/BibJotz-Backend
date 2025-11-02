import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { CreateJourneyCommand } from "./create-journey.command";
import { Journey } from "@/domain/Jouney/jouney";
import { JourneyFactory } from "@/domain/Jouney/journey-factory";
import { IJourneyRepository } from "@/domain/Jouney/journey-repository.interface";


export class CreateJourneyCommandHandler implements ICommandHandler<CreateJourneyCommand, Journey> {
    constructor(private readonly journeyRepository: IJourneyRepository) {}

    async execute(command: CreateJourneyCommand): Promise<Journey> {
        const journey = JourneyFactory.create({
            id: null,
            title: command.title,
            ownerId: command.ownerId,
            guideId: command.guideId,
            reflections: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return this.journeyRepository.save(journey);
    }
}