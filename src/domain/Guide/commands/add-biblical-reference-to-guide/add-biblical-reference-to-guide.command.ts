import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { IAddBiblicalReferenceToGuideRequestDTO } from "@/domain/Guide/guide.dto";

function parseId(v: string | undefined): number {
    if (v == null || v === "") return 0;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? 0 : n;
}

export class AddBiblicalReferenceToGuideCommand implements ICommand {
    readonly commandType = 'AddBiblicalReferenceToGuideCommand';

    constructor(
        public readonly guideId: number,
        public readonly biblicalReferences: IBiblicalReferenceDTO[],
    ) {}

    static from(dto: IAddBiblicalReferenceToGuideRequestDTO): AddBiblicalReferenceToGuideCommand {
        return new AddBiblicalReferenceToGuideCommand(parseId(dto.guideId), dto.biblicalReferences);
    }
}