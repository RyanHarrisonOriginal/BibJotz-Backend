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
}

export interface IUserResponseDTO {
  id: number;
  displayName: string;
  clerkUserId: string | null;
  username: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

/** GET /users/:id. Public profile; clerkUserId stays off this response. */
export interface IUserProfileResponseDTO {
  id: number;
  displayName: string;
  username: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}
