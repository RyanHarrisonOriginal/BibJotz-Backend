export interface ICreateUserRequestDTO {
  displayName?: string;
}

export interface IGetUserParamsDTO {
  id?: string;
}

export interface IUserResponseDTO {
  id: number;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}
