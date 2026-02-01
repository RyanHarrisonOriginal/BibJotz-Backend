export interface IDraftDTO {
    id: string | null;
    name: string;
    userId: number;
    draftContent: Record<string, any>;
    draftKey: string;
    publishedAt: Date | null;
}

/** Request DTO: body for POST /drafts (create draft) */
export interface ICreateDraftBodyDTO {
    userId?: number | string;
    name?: string;
    draftKey?: string;
    draftContent?: Record<string, unknown>;
}

/** Request DTO: params for update/delete/get/publish draft (draftKey in route) */
export interface IDraftKeyParamsDTO {
    draftKey?: string;
}

/** Request DTO: update = params + body. Pass { draftKey, draftContent } from controller. */
export interface IUpdateDraftRequestDTO {
    draftKey?: string;
    draftContent?: Record<string, unknown>;
}

/** Request DTO: params for GET /users/:userId/drafts */
export interface IGetAllDraftsByAuthorParamsDTO {
    userId?: string;
}

