import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { SaveReflectionCommand } from "@/domain/Reflection/commands/save-reflection/save-reflection.command";
import { Reflection } from "@/domain/Reflection/reflection";
import { IReflectionRepository } from "@/domain/Reflection/reflection-repository.interface";
import { ReflectionMapper } from "@/domain/Reflection/reflection.mapper";
import { ReflectionFactory } from "@/domain/Reflection/reflection-factory";

export class SaveReflectionCommandHandler implements ICommandHandler<SaveReflectionCommand, Reflection> {
    constructor(private readonly reflectionRepository: IReflectionRepository) {}

    async execute(command: SaveReflectionCommand): Promise<Reflection> {
        const existingData = await this.reflectionRepository.findReflection(command.reflectionId);
        if (!existingData) {
            throw new Error(`Reflection with id ${command.reflectionId} not found`);
        }
        const existing = ReflectionMapper.mapReflectionToDomain(existingData);
        const updatedContent = command.content !== undefined ? command.content : existing.getContent();
        const updated = ReflectionFactory.create({
            id: existing.getId(),
            content: updatedContent,
            authorId: existing.getAuthorId(),
            journeyId: existing.getJourneyId(),
            guideSectionId: existing.getGuideSectionId(),
            biblicalReferences: existing.getBiblicalReferences(),
        });
        await this.reflectionRepository.save(updated);
        const savedData = await this.reflectionRepository.findReflection(command.reflectionId);
        return ReflectionMapper.mapReflectionToDomain(savedData);
    }
}
