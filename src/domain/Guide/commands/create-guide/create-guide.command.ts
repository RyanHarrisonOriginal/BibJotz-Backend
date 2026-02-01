import { IBiblicalReferenceDTO } from "@/domain/BiblicalReferences/biblical-reference.dto";
import { IGuideDTO } from "@/domain/Guide/guide.dto";
import { IGuideSectionDTO } from "@/domain/Guide/Sections/guide-section.dto";
import { ICommand } from "@/domain/shared/interfaces/command.interface";

export class CreateGuideCommand implements ICommand {
    readonly commandType = 'CreateGuideCommand';

    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly isPublic: boolean,
        public readonly biblicalReferences: IBiblicalReferenceDTO[],
        public readonly guideSections: IGuideSectionDTO[],
        public readonly authorId: number,
    ) {}

    static from(dto: IGuideDTO): CreateGuideCommand {
        return new CreateGuideCommand(
            dto.name,
            dto.description,
            dto.isPublic,
            dto.biblicalReferences,
            dto.guideSections,
            dto.authorId,
        );
    }
}
