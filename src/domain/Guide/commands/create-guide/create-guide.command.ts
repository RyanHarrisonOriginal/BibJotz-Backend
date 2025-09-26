import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { BiblicalReference } from "@/domain/shared/value-objects/BiblicalReference"; 
import { GuideSection } from "@/domain/Guide/guide-section";

export class CreateGuideCommand implements ICommand {
    readonly commandType = 'CreateGuideCommand';

    constructor(
        public readonly name: string,
        public readonly description: string,        
        public readonly isPublic: boolean,
        public readonly biblicalReferences: BiblicalReference[],
        public readonly guideSections: GuideSection[],
    ) {}
}
