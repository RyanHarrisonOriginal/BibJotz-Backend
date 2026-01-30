import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { CreateReflectionCommand } from "@/domain/Reflection/commands/create-reflection/create-reflection.command";
import { Reflection } from "@/domain/Reflection/reflection";
import { ReflectionFactory } from "@/domain/Reflection/reflection-factory";
import { IReflectionRepository } from "@/domain/Reflection/reflection-repository.interface";
import { ReflectionMapper } from "@/domain/Reflection/reflection.mapper";

export class CreateReflectionCommandHandler implements ICommandHandler<CreateReflectionCommand, Reflection> {
    constructor(private readonly reflectionRepository: IReflectionRepository) {}
    
    async execute(command: CreateReflectionCommand): Promise<Reflection> {
        const reflection = ReflectionFactory.create({
            id: null,
            content: command.content,
            authorId: command.authorId,
            guideSectionId: command.guideSectionId,
            journeyId: command.journeyId,
            biblicalReferences: command.biblicalReferences,
        });
        const savedReflectionData = await this.reflectionRepository.save(reflection);
        return ReflectionMapper.mapReflectionToDomain(savedReflectionData);
    }
}