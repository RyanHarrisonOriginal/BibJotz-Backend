import { BiblicalRefrence } from "../shared/value-objects/BiblicalReference";

export class GuideSection {
    constructor(
        private readonly title: string,
        private readonly description: string,
        private readonly biblicalRefrences: BiblicalRefrence[]
    ) {}

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getBiblicalRefrences(): BiblicalRefrence[] {
        return this.biblicalRefrences;
    }
}