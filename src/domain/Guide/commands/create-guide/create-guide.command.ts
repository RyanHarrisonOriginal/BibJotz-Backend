import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IBiblicalReferenceDTO } from "@/domain/Guide/guide.dto";
import { IGuideSectionDTO } from "@/domain/Guide/guide.dto";

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
}
