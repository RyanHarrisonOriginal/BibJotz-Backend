import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { IReflectionDTO } from "@/domain/Reflection/reflection.dto";

export class CreateReflectionCommand implements ICommand {
    readonly commandType = 'CreateReflectionCommand';

    constructor(
        public readonly journeyId: number,
        public readonly content: string,
        public readonly authorId: number,
        public readonly guideSectionId: number,
        public readonly biblicalReferences: IBiblicalReferenceDTO[],
    ) {}

    static from(dto: IReflectionDTO): CreateReflectionCommand {
        return new CreateReflectionCommand(
            dto.journeyId,
            dto.content,
            dto.authorId,
            dto.guideSectionId,
            dto.biblicalReferences,
        );
    }
}