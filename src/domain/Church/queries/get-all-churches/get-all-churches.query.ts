import { IQuery } from "@/domain/shared/interfaces/query.interface";

export interface IGetAllChurchesPayload {}

export class GetAllChurchesQuery implements IQuery {
    readonly queryType = 'GetAllChurchesQuery';

    static from(_payload?: IGetAllChurchesPayload): GetAllChurchesQuery {
        return new GetAllChurchesQuery();
    }
}
