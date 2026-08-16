import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { IQueryHandler } from '@/domain/shared/interfaces/query-handler.interface';

export class QueryBus {
  private handlers = new Map<string, IQueryHandler<IQuery, unknown>>();

  registerHandler<TQuery extends IQuery, TResult>(
    queryType: string,
    handler: IQueryHandler<TQuery, TResult>,
  ): void {
    this.handlers.set(queryType, handler as IQueryHandler<IQuery, unknown>);
  }

  async execute<TQuery extends IQuery, TResult>(query: TQuery): Promise<TResult> {
    const handler = this.handlers.get(query.queryType);
    if (!handler) {
      throw new Error(`No handler registered for query type: ${query.queryType}`);
    }
    return handler.execute(query) as Promise<TResult>;
  }
}
