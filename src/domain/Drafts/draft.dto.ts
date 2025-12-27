export interface IDraftDTO {
    id: string | null;
    name: string;
    userId: number;
    draftContent: Record<string, any>;
    draftKey: string;
    publishedAt: Date | null;
}

