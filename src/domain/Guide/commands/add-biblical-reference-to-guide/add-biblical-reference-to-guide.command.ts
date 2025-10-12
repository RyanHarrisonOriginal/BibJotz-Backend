import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IBiblicalReferenceDTO } from "@/domain/Guide/guide.dto";

export class AddBiblicalReferenceToGuideCommand implements ICommand {
    readonly commandType = 'AddBiblicalReferenceToGuideCommand';

    constructor(
        public readonly guideId: number,
        public readonly biblicalReferences: IBiblicalReferenceDTO[],
    ) {}
}