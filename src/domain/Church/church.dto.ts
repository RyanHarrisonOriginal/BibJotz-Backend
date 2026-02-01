export interface IChurchDTO {
    id: string | null;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    website: string;
    email: string;
    phone: string;
}

export interface IGetChurchQueryParamsDTO {
    id?: string | string[];
    name?: string;
    city?: string;
    state?: string;
    zip?: string;
}