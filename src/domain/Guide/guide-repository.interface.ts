import { Guide } from "@/domain/Guide/guide";

export interface IGuideRepository {
    save(guide: Guide): Promise<any>;
    findGuideById(id: number): Promise<any>;
    findGuideByName(name: string): Promise<any>;
    deleteGuide(guideId: number, userId: number): Promise<void>;
    getGuideInfoListRaw(userId: number): Promise<{ guides: any[]; counts: any[] }>;
}   