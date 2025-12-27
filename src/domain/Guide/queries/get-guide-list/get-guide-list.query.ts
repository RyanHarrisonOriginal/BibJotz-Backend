import { IQuery } from "@/domain/shared/interfaces/query.interface";

export class GetGuideListQuery implements IQuery {
    readonly queryType = 'GetGuideListQuery';
}