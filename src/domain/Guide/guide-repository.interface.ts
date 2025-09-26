import { Guide } from "./guide";

export interface IGuideRepository {
    save(guide: Guide): Promise<Guide>;
    findById(id: number): Promise<Guide>;
    findByName(name: string): Promise<Guide>;
    findAll(): Promise<Guide[]>;
}