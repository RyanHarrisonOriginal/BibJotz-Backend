export interface IDraftDTO {
    id: string | null;
    name: string;
    userId: number;
    draftContent: Record<string, any>;
    draftKey: string;
    publishedAt: Date | null;
}

export interface ICreateDraftBodyDTO {
    userId?: number | string;
    name?: string;
    draftKey?: string;
    draftContent?: Record<string, unknown>;
}

export interface IDraftKeyParamsDTO {
    draftKey?: string;
}

export interface IUpdateDraftRequestDTO {
    draftKey?: string;
    draftContent?: Record<string, unknown>;
}

export interface IGetAllDraftsByAuthorParamsDTO {
    userId?: string;
}

