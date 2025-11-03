import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { CreateReflectionCommand } from "@/domain/Reflection/commands/create-reflection/create-reflection.command";
import { Reflection } from "@/domain/Reflection/reflection";
import { ReflectionFactory } from "@/domain/Reflection/reflection-factory";
import { IReflectionRepository } from "@/domain/Reflection/reflection-repository.interface";

export class CreateReflectionCommandHandler implements ICommandHandler<CreateReflectionCommand, Reflection> {
    constructor(private readonly reflectionRepository: IReflectionRepository) {}
    
    async execute(command: CreateReflectionCommand): Promise<Reflection> {
        console.log('command', command);
        const reflection = ReflectionFactory.create({
            id: null,
            content: command.content,
            authorId: command.authorId,
            guideSectionId: command.guideSectionId,
            journeyId: command.journeyId,
            biblicalReferences: command.biblicalReferences,
        });
        console.log('reflection', reflection);
        return this.reflectionRepository.save(reflection);
    }
}