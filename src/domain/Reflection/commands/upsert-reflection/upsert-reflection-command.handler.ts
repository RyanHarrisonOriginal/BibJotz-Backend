import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { UpsertReflectionCommand } from "@/domain/Reflection/commands/upsert-reflection/upsert-reflection.command";
import { Reflection } from "@/domain/Reflection/reflection";
import { IReflectionRepository } from "@/domain/Reflection/reflection-repository.interface";
import { ReflectionMapper } from "@/domain/Reflection/reflection.mapper";
import { ReflectionFactory } from "@/domain/Reflection/reflection-factory";

export class UpsertReflectionCommandHandler implements ICommandHandler<UpsertReflectionCommand, Reflection> {
    constructor(private readonly reflectionRepository: IReflectionRepository) {}

    async execute(command: UpsertReflectionCommand): Promise<Reflection> {
        const saved = await this.reflectionRepository.upsertReflection(
            command.entryKey,
            command.journeyId,
            command.guideSectionId,
            command.authorId,
            command.content,
        );
        return ReflectionMapper.mapReflectionToDomain(saved);
    }
}
