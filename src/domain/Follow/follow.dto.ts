export interface IFollowUserRequestDTO {
  followerId?: number;
  followingId?: number | string;
}

export interface IUnfollowUserRequestDTO {
  followerId?: string | string[];
  followingId?: string;
}

export interface IListFollowsQueryParamsDTO {
  userId?: string;
  viewerUserId?: string;
}

export interface IFollowResponseDTO {
  id: number;
  followerId: number;
  followingId: number;
  status: 'PENDING' | 'ACCEPTED';
  createdAt: string;
}

export interface IFollowUserSummaryDTO {
  id: number;
  displayName: string;
  username: string | null;
  followedAt: string;
}

export interface IListFollowRequestsQueryDTO {
  userId?: string;
  limit?: string | string[];
  cursorCreatedAt?: string | string[];
  cursorId?: string | string[];
}

export interface IFollowRequestItemDTO {
  id: number;
  followerId: number;
  displayName: string;
  username: string | null;
  status: 'PENDING';
  createdAt: string;
}

export interface IFollowRequestCursorDTO {
  createdAt: string;
  id: number;
}

export interface IFollowRequestListDTO {
  requests: IFollowRequestItemDTO[];
  nextCursor: IFollowRequestCursorDTO | null;
}

export interface IFollowRequestActionDTO {
  followeeId?: number;
  followerId?: string;
}

export interface IUpdateFollowSettingsRequestDTO {
  userId?: number;
  followPolicy?: unknown;
  followListsPublic?: unknown;
}

export interface IFollowSettingsResponseDTO {
  followPolicy: 'OPEN' | 'APPROVAL';
  followListsPublic: boolean;
}
