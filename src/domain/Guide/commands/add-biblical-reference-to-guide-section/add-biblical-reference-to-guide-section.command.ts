import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IBiblicalReferenceDTO } from "@/domain/Guide/guide.dto";

export class AddBiblicalReferenceToGuideSectionCommand implements ICommand {
    readonly commandType = 'AddBiblicalReferenceToGuideSectionCommand';

    constructor(
        public readonly guideId: number,
        public readonly sectionId: number,
        public readonly biblicalReferences: IBiblicalReferenceDTO[],
    ) {}
}
