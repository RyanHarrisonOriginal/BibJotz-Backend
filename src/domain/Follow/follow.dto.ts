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
}

export interface IFollowResponseDTO {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: string;
}

export interface IFollowUserSummaryDTO {
  id: number;
  displayName: string;
  username: string | null;
  followedAt: string;
}
