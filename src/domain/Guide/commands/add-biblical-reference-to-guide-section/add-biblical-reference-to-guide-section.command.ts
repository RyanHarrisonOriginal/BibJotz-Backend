import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { IAddBiblicalReferenceToGuideSectionRequestDTO } from "@/domain/Guide/guide.dto";

function parseId(v: string | undefined): number {
    if (v == null || v === "") return 0;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? 0 : n;
}

export class AddBiblicalReferenceToGuideSectionCommand implements ICommand {
    readonly commandType = 'AddBiblicalReferenceToGuideSectionCommand';

    constructor(
        public readonly guideId: number,
        public readonly sectionId: number,
        public readonly biblicalReferences: IBiblicalReferenceDTO[],
    ) {}

    static from(dto: IAddBiblicalReferenceToGuideSectionRequestDTO): AddBiblicalReferenceToGuideSectionCommand {
        return new AddBiblicalReferenceToGuideSectionCommand(
            parseId(dto.guideId),
            parseId(dto.sectionId),
            dto.biblicalReferences,
        );
    }
}
