import { Guide } from "@/domain/Guide/guide";
import { GuideListPayload } from "@/domain/Guide/guide.interface";

export interface IGuideRepository {
    save(guide: Guide): Promise<Guide>;
    findGuideById(id: number): Promise<Guide>;
    findGuideByName(name: string): Promise<Guide>;
    deleteGuide(guideId: number, userId: number): Promise<void>;
    getGuideList(userId: number): Promise<GuideListPayload>;
}