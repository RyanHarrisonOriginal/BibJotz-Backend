export interface ICreateUserRequestDTO {
  displayName?: string;
  clerkUserId?: string | null;
  username?: string | null;
  bio?: string | null;
}

export interface IUpdateUserRequestDTO {
  id?: string;
  displayName?: string;
  clerkUserId?: string | null;
  username?: string | null;
  bio?: string | null;
}

export interface IGetUserParamsDTO {
  id?: string;
  viewerUserId?: string;
}

export type ViewerFollowStatus = 'NONE' | 'PENDING' | 'ACCEPTED';

export interface IUserResponseDTO {
  id: number;
  displayName: string;
  clerkUserId: string | null;
  username: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

/** GET /users/me. */
export interface IUserMeResponseDTO extends IUserResponseDTO {
  followPolicy: 'OPEN' | 'APPROVAL';
  followListsPublic: boolean;
  pendingRequestCount: number;
}

/** GET /users/:id. Public profile; clerkUserId stays off this response. */
export interface IUserProfileResponseDTO {
  id: number;
  displayName: string;
  username: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  followerCount: number;
  followingCount: number;
  followPolicy: 'OPEN' | 'APPROVAL';
  viewerFollowStatus: ViewerFollowStatus;
}
