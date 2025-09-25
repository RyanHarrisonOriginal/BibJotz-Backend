import { IQuery } from "@/domain/shared/interfaces/query.interface";

export class GetAllChurchesQuery implements IQuery {
    readonly queryType = 'GetAllChurchesQuery';
}
