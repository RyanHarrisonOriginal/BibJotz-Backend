import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { IReflectionDTO } from "@/domain/Reflection/reflection.dto";

export class CreateReflectionCommand implements ICommand {
    readonly commandType = 'CreateReflectionCommand';

    constructor(
        public readonly entryKey: string,
        public readonly journeyId: number,
        public readonly content: string,
        public readonly authorId: number,
        public readonly guideSectionId: number,
        public readonly biblicalReferences: IBiblicalReferenceDTO[],
    ) {}

    static from(dto: IReflectionDTO & { entry_key?: string }): CreateReflectionCommand {
        const entryKey = (dto.entryKey ?? (dto as { entry_key?: string }).entry_key)?.trim();
        if (!entryKey) throw new Error('entry_key is required');
        return new CreateReflectionCommand(
            entryKey,
            dto.journeyId,
            dto.content,
            dto.authorId,
            dto.guideSectionId,
            dto.biblicalReferences,
        );
    }
}