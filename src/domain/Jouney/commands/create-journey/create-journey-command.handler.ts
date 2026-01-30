import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { CreateJourneyCommand } from "./create-journey.command";
import { Journey } from "@/domain/Jouney/jouney";
import { JourneyFactory } from "@/domain/Jouney/journey-factory";
import { JourneyWriteRunner } from "@/infrastructure/transactions/runners/journey-write.runner";
import { GuideMapper } from "@/domain/Guide/guide.mapper";
import { JourneyMapper } from "@/domain/Jouney/journey.mapper";

// TODO: Create a Journey Unit of Work
export class CreateJourneyCommandHandler implements ICommandHandler<CreateJourneyCommand, Journey> {
    constructor(private readonly runner: JourneyWriteRunner) { }

    async execute(command: CreateJourneyCommand): Promise<Journey> {
        return await this.runner.run(async (uow) => {
            const sourceGuideData = await uow.guides.findGuideById(command.guideId);
            const sourceGuide = GuideMapper.mapGuideModelToDomain(sourceGuideData);
            const journey = JourneyFactory.create({
                id: null,
                name: command.name,
                ownerId: command.ownerId,
                sourceGuide: GuideMapper.mapGuideToInterface(sourceGuide),
                sections: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const savedJourneyData = await uow.journeys.save(journey);
            return JourneyMapper.mapJourneyModelToDomain(savedJourneyData);
        });
    }
}