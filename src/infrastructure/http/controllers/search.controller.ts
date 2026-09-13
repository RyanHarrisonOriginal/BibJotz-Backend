import { Request, Response } from 'express';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { SearchQuery } from '@/domain/Search/queries/search/search.query';
import { ISearchResult } from '@/domain/Search/queries/search/search-query.handler';

export class SearchController {
  constructor(private readonly queryBus: QueryBus) {}

  search = async (req: Request, res: Response): Promise<void> => {
    const query = SearchQuery.from(req.query as Record<string, string | string[] | undefined>);
    const result = await this.queryBus.execute<SearchQuery, ISearchResult>(query);
    res.json(result);
  };
}
