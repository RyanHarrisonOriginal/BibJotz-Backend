import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IGuideSectionDTO } from "@/domain/Guide/Sections/guide-section.dto";

export class AddGuideSectionCommand implements ICommand {
    readonly commandType = 'AddGuideSectionCommand';

    constructor(
        public readonly guideId: number,
        public readonly guideSection: IGuideSectionDTO,
    ) {}
}
