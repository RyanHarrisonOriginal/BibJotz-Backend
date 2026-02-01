import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IAddBiblicalReferencesToReflectionRequestDTO } from "@/domain/Reflection/reflection.dto";

export class AddBiblicalReferencesToReflectionCommand implements ICommand {
    readonly commandType = 'AddBiblicalReferencesToReflectionCommand';

    constructor(
        public readonly reflectionId: number,
        public readonly biblicalReferences: IBiblicalReferenceDTO[],
    ) {}

    static from(dto: IAddBiblicalReferencesToReflectionRequestDTO): AddBiblicalReferencesToReflectionCommand {
        const reflectionId = parseInt(dto.reflectionId ?? "0", 10);
        return new AddBiblicalReferencesToReflectionCommand(
            Number.isNaN(reflectionId) ? 0 : reflectionId,
            dto.biblicalReferences,
        );
    }
}