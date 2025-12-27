import { Guide } from "@/domain/Guide/guide";
import { GuideListItem } from "@/domain/Guide/guide.interface";

export interface IGuideRepository {
    save(guide: Guide): Promise<Guide>;
    findGuideById(id: number): Promise<Guide>;
    findGuideByName(name: string): Promise<Guide>;
    getGuideList(): Promise<GuideListItem[]>;
}