export type SearchType = 'all' | 'people' | 'notes';

export interface ISearchQueryParamsDTO {
  q?: string | string[];
  type?: string | string[];
  limit?: string | string[];
  viewerUserId?: string | string[];
}

export interface ISearchResponseDTO {
  people: unknown[];
  notes: unknown[];
}
