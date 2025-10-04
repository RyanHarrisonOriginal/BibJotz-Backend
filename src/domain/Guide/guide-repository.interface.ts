import { Guide } from "./guide";

export interface IGuideRepository {
    save(guide: Guide): Promise<Guide>;
    findGuideById(id: number): Promise<Guide>;
    findGuideByName(name: string): Promise<Guide>;
    findAllGuides(): Promise<Guide[]>;
}