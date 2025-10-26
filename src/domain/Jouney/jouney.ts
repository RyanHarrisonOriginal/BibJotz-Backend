import { BaseEntity } from "../BaseEntity";
import { IGuideDTO } from "../Guide/guide.dto";
import { Reflection } from "../Reflection/reflection";



export class Journey extends BaseEntity {
    constructor(
        id: number | null,
        private readonly title: string,
        private readonly ownerId: number,
        private readonly guide: IGuideDTO,
        private readonly reflections: Reflection[] = [],
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ){
        super(id ?? 0, createdAt, updatedAt);
    }

    getTitle(): string {
        return this.title;
    }

    getOwnerId(): number {
        return this.ownerId;
    }

    getGuide(): IGuideDTO {
        return this.guide;
    }

    getReflections(): Reflection[] {
        return this.reflections;
    }

    addReflection(reflection: Reflection) {
        this.reflections.push(reflection);
        this.touch();
    }


}