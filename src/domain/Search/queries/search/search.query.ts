import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { ISearchQueryParamsDTO, SearchType } from '@/domain/Search/search.dto';

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

const VALID_TYPES = new Set<SearchType>(['all', 'people', 'notes']);

export class SearchQuery implements IQuery {
  readonly queryType = 'SearchQuery';

  constructor(
    public readonly q: string,
    public readonly type: SearchType,
    public readonly limit: number,
    public readonly viewerUserId: number,
  ) {}

  static from(dto: ISearchQueryParamsDTO): SearchQuery {
    const q = (first(dto.q) ?? '').trim();
    if (q.length < 1) throw new ValidationError('q is required');
    if (q.length > 100) throw new ValidationError('q must be at most 100 characters');

    const rawType = (first(dto.type) ?? 'all').toLowerCase() as SearchType;
    if (!VALID_TYPES.has(rawType)) {
      throw new ValidationError('type must be all, people, or notes');
    }

    const rawLimit = first(dto.limit);
    const limit = rawLimit != null ? parseInt(String(rawLimit), 10) : 20;
    if (Number.isNaN(limit) || limit < 1) throw new ValidationError('limit must be a positive integer');

    const viewerUserId = parseInt(String(first(dto.viewerUserId) ?? ''), 10);
    if (Number.isNaN(viewerUserId) || viewerUserId < 1) {
      throw new ValidationError('viewerUserId is required');
    }

    return new SearchQuery(q, rawType, Math.min(limit, 50), viewerUserId);
  }
}
