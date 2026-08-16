import { IQuery } from './query.interface';

export interface IQueryHandler<TQuery extends IQuery, TResult = unknown> {
  execute(query: TQuery): Promise<TResult>;
}
