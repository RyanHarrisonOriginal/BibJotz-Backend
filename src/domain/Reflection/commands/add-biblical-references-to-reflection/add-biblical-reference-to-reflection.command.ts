import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { ICommand } from "@/domain/shared/interfaces/command.interface";

export class AddBiblicalReferencesToReflectionCommand implements ICommand {
    readonly commandType = 'AddBiblicalReferencesToReflectionCommand';

    constructor(
        public readonly reflectionId: number,
        public readonly biblicalReferences: IBiblicalReferenceDTO[],
    ) {}
}