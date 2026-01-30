import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";
import { AddBiblicalReferencesToReflectionCommand } from "@/domain/Reflection/commands/add-biblical-references-to-reflection/add-biblical-reference-to-reflection.command";
import { Reflection } from "@/domain/Reflection/reflection";
import { IReflectionRepository } from "@/domain/Reflection/reflection-repository.interface";
import { BiblicalReferenceFactory } from "@/domain/BiblicalReferences/biblical-reference-factory";
import { ReflectionMapper } from "@/domain/Reflection/reflection.mapper";

export class AddBiblicalReferencesToReflectionCommandHandler implements ICommandHandler<AddBiblicalReferencesToReflectionCommand, Reflection> {
    constructor(private readonly reflectionRepository: IReflectionRepository) {}

    async execute(command: AddBiblicalReferencesToReflectionCommand): Promise<Reflection> {
        const biblicalReferences = BiblicalReferenceFactory.createArray(command.biblicalReferences);
        const reflectionData = await this.reflectionRepository.findReflection(command.reflectionId ?? 0);
        const reflection = ReflectionMapper.mapReflectionToDomain(reflectionData);
        reflection.addBiblicalReferences(biblicalReferences);
        const savedReflectionData = await this.reflectionRepository.save(reflection);
        return ReflectionMapper.mapReflectionToDomain(savedReflectionData);
    }
}