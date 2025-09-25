import { IQuery } from "@/domain/interfaces/shared/query.interface";

export interface IQueryHandler<QueryType extends IQuery, ResultType = any> {
    execute(query: QueryType): Promise<ResultType>;
}