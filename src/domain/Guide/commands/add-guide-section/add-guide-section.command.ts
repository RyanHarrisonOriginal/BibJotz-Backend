import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IAddGuideSectionRequestDTO } from "@/domain/Guide/guide.dto";
import { IGuideSectionDTO } from "@/domain/Guide/Sections/guide-section.dto";

function parseId(v: string | undefined): number {
    if (v == null || v === "") return 0;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? 0 : n;
}

export class AddGuideSectionCommand implements ICommand {
    readonly commandType = 'AddGuideSectionCommand';

    constructor(
        public readonly guideId: number,
        public readonly guideSection: IGuideSectionDTO,
    ) {}

    static from(dto: IAddGuideSectionRequestDTO): AddGuideSectionCommand {
        return new AddGuideSectionCommand(parseId(dto.guideId), dto.guideSection);
    }
}
