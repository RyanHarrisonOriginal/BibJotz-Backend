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

/** Request DTO: query string shape for GET /church. Values are strings from the request. */
export interface IGetChurchQueryParamsDTO {
    id?: string | string[];
    name?: string;
    city?: string;
    state?: string;
    zip?: string;
}